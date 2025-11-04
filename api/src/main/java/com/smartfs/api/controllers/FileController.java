package com.smartfs.api.controllers;

import com.smartfs.api.data.models.FileData;
import com.smartfs.api.managers.FileManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;

@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileManager fileManager;

    @PostMapping("/new/{authorId}")
    public ResponseEntity uploadNewFile(@RequestBody File file, @PathVariable("authorId") String authorId){
        try{
            
        }catch (Exception e){

        }finally {

        }
    }
}
