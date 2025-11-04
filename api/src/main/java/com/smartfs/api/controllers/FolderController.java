package com.smartfs.api.controllers;

import com.smartfs.api.data.models.Folder;
import com.smartfs.api.managers.FolderManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("folder")
public class FolderController {

    @Autowired
    private FolderManager folderManager;

    @GetMapping("/subFolders/{userId}/{parentId}") //send parentId as 0 for root folders
    public ResponseEntity getSubFolders(@PathVariable("userId") String ownerId, @PathVariable("parentId") int parentId){

        List<Folder> folders = new ArrayList<>();
        try{
            folders = folderManager.getFoldersByOwnerAndParent(ownerId, parentId);
            return new ResponseEntity<>(folders, HttpStatus.ACCEPTED);
        }catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/new")
    public ResponseEntity createNewFolder(@RequestBody Folder newFolderData){
        try{
            if(newFolderData.getFolderName() == null || newFolderData.getFolderOwner() == null){
                return new ResponseEntity<>("Missing values", HttpStatus.BAD_REQUEST);
            }

            newFolderData = folderManager.newFolder(newFolderData);

            return new ResponseEntity<>(newFolderData, HttpStatus.CREATED);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
