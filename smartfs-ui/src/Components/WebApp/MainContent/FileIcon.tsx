import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./contentPageStyles.css";

import { fileProps } from './file.interface';

const FileIcon: React.FC<fileProps> = ({ fileName, fileId, path, fileSize, folderId, createdAt, updatedAt }) => {
    return (
        <div className='item-box'>
            <i className="fa-solid fa-file fa-6x"></i>
            <strong className='item-name'>{fileName}</strong>
        </div>
    )
}

export default FileIcon
