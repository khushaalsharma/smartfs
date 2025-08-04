USE SmartFS

CREATE TABLE userData(
	userId INT AUTO_INCREMENT NOT NULL,
	firebaseId NVARCHAR NOT NULL UNIQUE,
	PRIMARY KEY(userId)
);

CREATE TABLE fileData(
	fileId INT IDENTITY(1,1) NOT NULL,
	filename VARCHAR(50) NOT NULL,
	size BIGINT,
	path VARCHAR(100) NOT NULL UNIQUE,
	content NVARCHAR(10000) NOT NULL,
	userId INT NOT NULL,
	createdAt timestamp DEFAULT DATE_NOW(),
	PRIMARY KEY(fileId),
	FOREIGN KEY(userId) REFERENCES user.userId
);

CREATE TABLE userDirectories (
    directoryId INT IDENTITY(1,1) NOT NULL,
	directoryName VARCHAR(100) NOT NULL,
    path VARCHAR(500) NOT NULL UNIQUE,
    userId INT NOT NULL,
    createdAt DATETIME2 DEFAULT SYSDATETIME(),
    PRIMARY KEY (directoryId),
    FOREIGN KEY (userId) REFERENCES dbo.userData(userId)
);