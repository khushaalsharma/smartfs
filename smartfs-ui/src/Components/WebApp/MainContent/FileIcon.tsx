import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./contentPageStyles.css";

import { fileProps } from './file.interface';

const FileIcon: React.FC<fileProps> = ({ file_name, file_id, file_loc, size, folder_id, createdAt, updatedAt }) => {
    return (
        <div className='item-box'>
            <i className="fa-solid fa-file fa-6x"></i>
            <strong className='item-name'>{file_name}</strong>
        </div>
    )
}

export default FileIcon
