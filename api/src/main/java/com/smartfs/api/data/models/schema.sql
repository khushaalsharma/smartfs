CREATE SCHEMA IF NOT EXISTS dbo;

CREATE TABLE IF NOT EXISTS dbo.folder_data (
    folderPkId SERIAL PRIMARY KEY,
    folderName VARCHAR(100) NOT NULL,
    folderOwner VARCHAR(100) NOT NULL,
    parentFolderPkId INT,
    contentSize INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parentFolderPkId) REFERENCES dbo.folder_data(folderPkId)
);

CREATE TABLE IF NOT EXISTS dbo.file_data (
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
    FOREIGN KEY (folderPkId) REFERENCES dbo.folder_data(folderPkId)
);
