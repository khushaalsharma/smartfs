USE smartfs;

CREATE TABLE folderData (
    folder_id INT IDENTITY(1,1) NOT NULL,
    folder_name NVARCHAR(255) NOT NULL,
    parent_folder_id INT NULL,
    user_id INT NOT NULL, 
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL,
    PRIMARY KEY (folder_id),
    FOREIGN KEY (parent_folder_id) REFERENCES folderData(folder_id)
);

CREATE TABLE fileData (
    file_id INT IDENTITY(1,1) NOT NULL,
    file_name NVARCHAR(255) NOT NULL,
	disk_file_name NVARVHAR(255) NOT NULL,
    extension NVARCHAR(10) NOT NULL,
    file_loc NVARCHAR(1000) NOT NULL,
    folder_id INT NOT NULL,
    file_size BIGINT,
    author INT NOT NULL, 
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 NULL,
    PRIMARY KEY (file_id),
    FOREIGN KEY (folder_id) REFERENCES folderData(folder_id)
);
