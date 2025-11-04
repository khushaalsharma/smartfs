package com.smartfs.api.managers;

import com.smartfs.api.data.models.Folder;
import com.smartfs.api.repositories.IFolderRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FolderManager {

    @Autowired
    private IFolderRepository folderRepository;

    public List<Folder> getFoldersByOwnerAndParent(String ownerId, int parentFolderId){
        List<Folder> foldersList = new ArrayList<>();
        if(parentFolderId > 0){
            foldersList = folderRepository.getFolderByParent(ownerId, parentFolderId);
        }
        else{
            foldersList = folderRepository.getFoldersByAtRoot(ownerId);
        }

        return foldersList;
    }

    public Folder newFolder(Folder newFolderData){
        return folderRepository.save(newFolderData);
    }

}
