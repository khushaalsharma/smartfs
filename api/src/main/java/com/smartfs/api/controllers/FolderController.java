package com.smartfs.api.controllers;

import com.smartfs.api.data.models.Folder;
import com.smartfs.api.managers.FolderManager;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("folder")
public class FolderController {

    @Autowired
    private FolderManager folderManager;

    @GetMapping("/subFolders/:userId/:parentId") //send parentId as 0 for root folders
    public List<Folder> getSubFolders(@PathParam("userId") String ownerId, @PathParam("parentId") int parentId){

        List<Folder> folders = new ArrayList<>();
        try{
            folders = folderManager.getFoldersByOwnerAndParent(ownerId, parentId);
        }catch(Exception e){
            e.printStackTrace();
        }

        return folders;
    }
}
