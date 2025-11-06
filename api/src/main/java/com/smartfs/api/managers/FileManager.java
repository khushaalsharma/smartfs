package com.smartfs.api.managers;

import com.smartfs.api.data.dto.NewFileDTO;
import com.smartfs.api.data.models.FileData;
import com.smartfs.api.repositories.IFileRepository;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FileManager {

    @Autowired
    private IFileRepository fileRepository;

    @Autowired
    private OllamaManager ollamaManager;

    @Autowired
    private QdrantManager qdrantManager;

    public FileData saveFileMetaData(FileData newFileData){
        return fileRepository.save(newFileData);
    }

    public List<FileData> getFilesByAuthorAndFolder(String ownerId, int folderId){
        if(folderId > 0){
            return fileRepository.getFileByAuthorAndFolder(ownerId, folderId);
        }
        else{
            return fileRepository.getFilesAtRoot(ownerId);
        }
    }

    private void processFile(MultipartFile file, FileData newFile) throws Exception {
        // Extract text content from file using Apache Tika
        String content;
        try (InputStream stream = file.getInputStream()) {
            content = new Tika().parseToString(stream);
        }

        // Split content into smaller chunks for better embedding performance
        List<String> chunks = getContentChunks(content, 1000);

        // Process file content chunks and upload embeddings to Qdrant
        for (int i = 0; i < chunks.size(); i++) {
            float[] embeddings = ollamaManager.getEmbeddings(chunks.get(i));

            Map<String, Object> payload = Map.of(
                    "fileId", newFile.getFileId(),
                    "chunkIndex", i,
                    "type", "content",
                    "fileName", newFile.getFileName(),
                    "mimeType", newFile.getMimeType()
            );

            qdrantManager.upsertVector(
                    "documents",
                    "chunk_" + newFile.getFileId() + "_" + i,
                    embeddings,
                    chunks.get(i),
                    payload
            );
        }

        // ---- Embed and upload metadata ----
        String metadataText = String.format(
                "File name: %s. Type: %s. Author: %s. Folder ID: %s.",
                newFile.getFileName(),
                newFile.getMimeType(),
                newFile.getFileAuthor(),
                newFile.getFolderId() > 0 ? newFile.getFolderId() : "root"
        );

        float[] metaEmbedding = ollamaManager.getEmbeddings(metadataText);

        Map<String, Object> metaPayload = Map.of(
                "fileId", newFile.getFileId(),
                "type", "metadata",
                "fileName", newFile.getFileName(),
                "mimeType", newFile.getMimeType(),
                "author", newFile.getFileAuthor()
        );

        qdrantManager.upsertVector(
                "documents",
                "meta_" + newFile.getFileId(),
                metaEmbedding,
                metadataText,
                metaPayload
        );
    }


    private List<String> getContentChunks(String content, int chunkSize){
        List<String> chunks = new ArrayList<>();
        for(int i=0; i<content.length(); i+= chunkSize){
            chunks.add(content.substring(i, Math.min(i+chunkSize, content.length())));
        }

        return chunks;
    }

    private String saveFileToDisk(MultipartFile file) throws IOException {
        Path uploadDir = Paths.get("uploads");

        // Create uploads directory if it doesn't exist
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Construct a unique file name to avoid collisions
        String originalFilename = file.getOriginalFilename();
        String timestamp = String.valueOf(System.currentTimeMillis());
        String safeFileName = timestamp + "_" + (originalFilename != null ? originalFilename : "uploadedFile");

        // Resolve the file path
        Path targetPath = uploadDir.resolve(safeFileName);

        // Copy file to target location (replace existing if needed)
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Return the absolute path of the stored file
        return targetPath.toAbsolutePath().toString();
    }


    public FileData uploadFile(MultipartFile file, NewFileDTO fileDto) throws Exception {
        String filePath = saveFileToDisk(file);
        FileData newFile = new FileData();

        newFile.setFileAuthor(fileDto.getAuthorId());
        newFile.setFolderId(fileDto.getFolderId() > 0 ? fileDto.getFolderId() : null);
        newFile.setFileName(file.getOriginalFilename());
        newFile.setMimeType(file.getContentType());
        newFile.setPath(filePath);

        newFile = saveFileMetaData(newFile);

        processFile(file, newFile);

        return newFile;
    }
}
