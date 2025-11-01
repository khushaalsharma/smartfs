package com.smartfs.api.data.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Table(name = "FolderData", schema = "dbo")
@Getter
@Setter
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

}
