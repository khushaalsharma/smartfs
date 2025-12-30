package com.smartfs.api.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartfs.api.data.dto.NewFileDTO;
import com.smartfs.api.data.dto.SearchDTO;
import com.smartfs.api.data.models.FileData;
import com.smartfs.api.managers.FileManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;


@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileManager fileManager;

    @PostMapping(value = "/new", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadNewFile(@RequestPart("data") String jsonfileDto, @RequestPart("file")MultipartFile file){
        try{
            ObjectMapper mapper = new ObjectMapper();
            System.out.println(jsonfileDto);
            NewFileDTO fileDto = mapper.readValue(jsonfileDto, NewFileDTO.class);
            return new ResponseEntity<>(fileManager.uploadFile(file, fileDto), HttpStatus.CREATED);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/byFolder/{authorId}/{folderId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity getFilesByFolder(@PathVariable("authorId") String authorId, @PathVariable("folderId") int folderId){
        try{
            return new ResponseEntity<>(fileManager.getFilesByAuthorAndFolder(authorId, folderId), HttpStatus.ACCEPTED);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/search")
    public ResponseEntity findFiles(@RequestBody SearchDTO searchDTO){
        try{
            List<FileData> files = fileManager.searchFile(searchDTO);
            if(files.isEmpty()){
                return new ResponseEntity<>("no file found", HttpStatus.OK);
            }
            return new ResponseEntity<>(files, HttpStatus.ACCEPTED);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
