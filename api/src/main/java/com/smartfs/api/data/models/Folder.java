package com.smartfs.api.data.models;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "FolderData", schema = "dbo")
public class Folder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "folderPkId")
    private int folderId;

    @Column(name = "folderName")
    private String folderName;

    @Column(name = "folderOwner")
    private String folderOwner;

    @Column(name = "contentSize")
    private int size;

    @OneToMany
    @JoinColumn(name = "parentFolderPkId", referencedColumnName = "folderPkId", nullable = true)
    private int parentId;

    @Column(name = "createdAt")
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

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
