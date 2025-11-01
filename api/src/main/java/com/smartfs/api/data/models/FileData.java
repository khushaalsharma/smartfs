package com.smartfs.api.data.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Table(name = "FileData", schema = "dbo")
@Getter
@Setter
public class FileData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "filePkId")
    private int fileId;

    @Column(name = "fileName")
    private String fileName;

    @Column(name = "fileExtension", nullable = true)
    private String fileExtension;

    @Column(name = "mimetype")
    private String mimeType;

    @Column(name = "localPath")
    private String path;

    @Column(name = "fileOwner")
    private String fileAuthor;

    @OneToOne
    @JoinColumn(name = "folderPkId", referencedColumnName = "folderPkId")
    private int folderId;

    @Column(name = "createdAt")
    private Timestamp createdAt;

    @Column(name = "updatedAt", nullable = true)
    private Timestamp updatedAt;
}
