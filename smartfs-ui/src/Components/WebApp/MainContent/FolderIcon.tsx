import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./contentPageStyles.css";

import { folderProps } from './folder.interface';

const FolderIcon: React.FC<folderProps> = ({ folder_name, folder_id, parent_id, createdAt, updatedAt }) => {
    return (
        <div className='item-box'>
            <i className="fa-solid fa-folder fa-6x"></i>
            <strong className='item-name'>{folder_name}</strong>
        </div>
    )
}

export default FolderIcon
