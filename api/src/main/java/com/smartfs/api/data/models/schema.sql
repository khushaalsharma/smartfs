CREATE SCHEMA IF NOT EXISTS dbo;

CREATE TABLE IF NOT EXISTS dbo."FolderData" (
    folderPkId SERIAL PRIMARY KEY,
    folderName VARCHAR(100) NOT NULL,
    folderOwner VARCHAR(100) NOT NULL,
    parentFolderPkId INT,
    contentSize INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parentFolderPkId) REFERENCES dbo."FolderData"(folderPkId)
);

CREATE TABLE IF NOT EXISTS dbo."FileData" (
    filePkId SERIAL PRIMARY KEY,
    fileName VARCHAR(100) NOT NULL,
    fileExtension VARCHAR(10),
    mimetype VARCHAR(50) NOT NULL,
    fileSize INT NOT NULL,
    localPath VARCHAR(100) NOT NULL,
    folderPkId INT,
    fileOwner VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    FOREIGN KEY (folderPkId) REFERENCES dbo."FolderData"(folderPkId)
);
