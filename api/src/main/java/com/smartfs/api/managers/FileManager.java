package com.smartfs.api.managers;

import com.smartfs.api.data.models.FileData;
import com.smartfs.api.repositories.IFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileManager {

    @Autowired
    private IFileRepository fileRepository;

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
}
