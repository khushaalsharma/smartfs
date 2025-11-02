package com.smartfs.api.repositories;

import com.smartfs.api.data.models.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IFolderRepository extends JpaRepository<Folder, Integer> {

    @Query("SELECT f FROM Folder f WHERE f.folderOwner = :owner AND f.parentId = null")
    List<Folder> getFoldersByAtRoot(@Param("owner") String ownerId);

    @Query("SELECT f FROM Folder f WHERE f.folderOwner = :owner AND f.parentId = parentId")
    List<Folder> getFolderByParent(@Param("owner") String ownerId, @Param("parentId") int parentFolderId);
}
