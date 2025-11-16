package com.smartfs.api.data.models;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "FileData", schema = "dbo")
public class FileData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "filepkid")
    private int fileId;

    @Column(name = "filename")
    private String fileName;

    @Column(name = "fileextension", nullable = true)
    private String fileExtension;

    @Column(name = "mimetype")
    private String mimeType;

    @Column(name = "localpath")
    private String path;

    @Column(name = "fileowner")
    private String fileAuthor;

    @OneToOne
    @JoinColumn(name = "folderpkid", nullable = true)
    private Folder folderId;

    @Column(name = "createdat")
    private Timestamp createdAt;

    @Column(name = "updatedat", nullable = true)
    private Timestamp updatedAt;

    public int getFileId() {
        return fileId;
    }

    public void setFileId(int fileId) {
        this.fileId = fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileExtension() {
        return fileExtension;
    }

    public void setFileExtension(String fileExtension) {
        this.fileExtension = fileExtension;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getFileAuthor() {
        return fileAuthor;
    }

    public void setFileAuthor(String fileAuthor) {
        this.fileAuthor = fileAuthor;
    }

    public Folder getFolderId() {
        return folderId;
    }

    public void setFolderId(Folder folderId) {
        this.folderId = folderId;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
