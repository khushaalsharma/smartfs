import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./contentPageStyles.css";

import { folderProps } from './folder.interface';

const FolderIcon: React.FC<folderProps> = ({ folderName, folderId, parentId, createdAt, updatedAt }) => {
    return (
        <div className='item-box'>
            <i className="fa-solid fa-folder fa-6x"></i>
            <strong className='item-name'>{folderName}</strong>
        </div>
    )
}

export default FolderIcon
