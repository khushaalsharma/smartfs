package com.smartfs.api.data.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "FolderData", schema = "dbo")
@NoArgsConstructor
@AllArgsConstructor
public class Folder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "folderpkid")
    private int folderId;

    @Column(name = "foldername")
    private String folderName;

    @Column(name = "folderowner")
    private String folderOwner;

    @Column(name = "contentsize")
    private int size;

    @ManyToOne
    @JoinColumn(name = "parentfolderpkid", nullable = true)
    private Folder parentId;

    @Column(name = "createdat")
    private Timestamp createdAt;

    public int getFolderId() {
        return folderId;
    }

    public void setFolderId(int folderId) {
        this.folderId = folderId;
    }

    public String getFolderName() {
        return folderName;
    }

    public void setFolderName(String folderName) {
        this.folderName = folderName;
    }

    public String getFolderOwner() {
        return folderOwner;
    }

    public void setFolderOwner(String folderOwner) {
        this.folderOwner = folderOwner;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public Folder getParentId() {
        return parentId;
    }

    public void setParentId(Folder parentId) {
        this.parentId = parentId;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
