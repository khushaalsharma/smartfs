package com.smartfs.api.repositories;

import com.smartfs.api.data.models.FileData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IFileRepository extends JpaRepository<FileData, Integer> {

    @Query("SELECT f FROM FileData f WHERE f.fileAuthor = :author AND f.folderId = :folderId")
    List<FileData> getFileByAuthorAndFolder(@Param("author") String author, @Param("folderId") int folderId);

    @Query("SELECT f FROM FileData f WHERE f.fileAuthor = :owner AND f.folderId = null")
    List<FileData> getFilesAtRoot(@Param("owner") String owner);

    @Query("SELECT f FROM FileData f WHERE f.fileId IN :fileIds")
    List<FileData> findAllById(@Param("fileIds") List<Object> fileIds);;
}
