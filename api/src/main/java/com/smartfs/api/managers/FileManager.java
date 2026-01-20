package com.smartfs.api.managers;

import com.smartfs.api.data.dto.NewFileDTO;
import com.smartfs.api.data.dto.SearchDTO;
import com.smartfs.api.data.models.FileData;
import com.smartfs.api.repositories.IFileRepository;
import io.qdrant.client.grpc.Points;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class FileManager {

    private final String collectionName = "file_chunk";

    @Autowired
    private IFileRepository fileRepository;

    @Autowired
    private OllamaManager ollamaManager;

    @Autowired
    private QdrantManager qdrantManager;

    @Autowired
    private SupabaseManager supabaseManager;

    public FileData saveFileMetaData(FileData newFileData){
        try {
            return fileRepository.save(newFileData);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public List<FileData> getFilesByAuthorAndFolder(String ownerId, int folderId){
        if(folderId > 0){
            return fileRepository.getFileByAuthorAndFolder(ownerId, folderId);
        }
        else{
            return fileRepository.getFilesAtRoot(ownerId);
        }
    }

    private Integer processFile( MultipartFile file, FileData newFile) throws Exception {
        // Extract text content from file using Apache Tika
        String content;
        try (InputStream stream = file.getInputStream()) {
            content = new Tika().parseToString(stream);
        }

        // Split content into smaller chunks for better embedding performance
        List<String> chunks = getContentChunks(content, 1000);

        // Process file content chunks and upload embeddings to Qdrant
        for (int i = 0; i < chunks.size(); i++) {
            List<Double> embeddings = ollamaManager.getEmbeddings(chunks.get(i));

            Map<String, Object> payload = Map.of(
                    "fileId", newFile.getFileId(),
                    "authorId", newFile.getFileAuthor(),
                    "chunkIndex", i,
                    "type", "content",
                    "fileName", newFile.getFileName(),
                    "mimeType", newFile.getMimeType(),
                    "text", chunks.get(i)
            );

            qdrantManager.upsertVector(
                    "file_chunk",
                    embeddings,
                    payload
            );
        }

        // ---- Embed and upload metadata ----
        String metadataText = String.format(
                "File name: %s. Type: %s. Author: %s. Folder ID: %s.",
                newFile.getFileName(),
                newFile.getMimeType(),
                newFile.getFileAuthor(),
                newFile.getFolderId() != null ? newFile.getFolderId().getFolderId() : "root"
        );

        List<Double> metaEmbedding = ollamaManager.getEmbeddings(metadataText);

        Map<String, Object> metaPayload = Map.of(
                "fileId", newFile.getFileId(),
                "type", "metadata",
                "fileName", newFile.getFileName(),
                "mimeType", newFile.getMimeType(),
                "author", newFile.getFileAuthor()
        );

        qdrantManager.upsertVector(
                "file_chunk",
                metaEmbedding,
                metaPayload
        );

        return chunks.size();
    }


    private List<String> getContentChunks(String content, int chunkSize){
        List<String> chunks = new ArrayList<>();
        for(int i=0; i<content.length(); i+= chunkSize){
            chunks.add(content.substring(i, Math.min(i+chunkSize, content.length())));
        }

        return chunks;
    }

    public FileData uploadFile(MultipartFile file, NewFileDTO fileDto) throws Exception {
        String originalFilename = file.getOriginalFilename();
        String timestamp = String.valueOf(System.currentTimeMillis());
        String safeFileName = timestamp + "_" + (originalFilename != null ? originalFilename : "uploadedFile");
        //uploading it to the cloud bucket
        String filePath = supabaseManager.uploadFile(file, safeFileName);

        FileData newFile = new FileData();

        newFile.setFileAuthor(fileDto.getAuthorId());
        newFile.setFolderId(fileDto.getFolderId());
        newFile.setFileName(file.getOriginalFilename());
        newFile.setMimeType(file.getContentType());
        newFile.setPath(filePath);
        newFile.setFileSize(file.getSize());
        newFile.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));

        newFile = saveFileMetaData(newFile);

        Integer chunks = processFile(file, newFile);

        // adding the number of vector chunks made for this file to the SQL DB
        newFile.setChunks(chunks);
        newFile = fileRepository.save(newFile);

        return newFile;
    }

    private List<Integer> finalFileId(List<Points.ScoredPoint> chunksFromQdrant) {
        // Group chunks by fileId and track the best score for each file
        Map<Long, Float> fileToBestScore = new HashMap<>();

        chunksFromQdrant.stream()
                .forEach(chunk -> {
                    Map<String, Object> payloadMap = qdrantManager.convertPayloadToMap(chunk.getPayloadMap());
                    Long fileId = (Long) payloadMap.get("fileId");

                    fileToBestScore.merge(fileId, chunk.getScore(), Math::max);
                });

        // Sort by best score and return top 5 files
        return fileToBestScore.entrySet().stream()
                .sorted(Map.Entry.<Long, Float>comparingByValue().reversed())
                .limit(5)
                .map(e -> e.getKey().intValue())
                .collect(Collectors.toList());
    }

    public List<FileData> searchFile(SearchDTO queryString) throws ExecutionException, InterruptedException {
        //convert the query string to its vector strings
        List<Double> vecEmbedds = ollamaManager.getEmbeddings(queryString.getQueryString());

        List<Points.ScoredPoint> response = qdrantManager.findData("file_chunk", vecEmbedds, queryString.getAuthorId());

        List<Integer> fileIdsFromQdrant = finalFileId(response);

        return fileRepository.findAllById(fileIdsFromQdrant);
    }
}

class chunkClass{
    private Float score;
    private Integer count;

    public chunkClass(Float score, Integer i) {
        this.count = i;
        this.score = score;
    }

    public Float getScore() {
        return score;
    }

    public void setScore(Float score) {
        this.score = score;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
