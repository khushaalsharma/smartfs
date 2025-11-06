package com.smartfs.api.controllers;

import com.smartfs.api.data.dto.NewFileDTO;
import com.smartfs.api.data.models.FileData;
import com.smartfs.api.managers.FileManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;

@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileManager fileManager;

    @PostMapping("/new")
    public ResponseEntity uploadNewFile(@RequestBody NewFileDTO fileDto, @RequestParam("file")MultipartFile file){
        try{

        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
