import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./contentPageStyles.css";
import "../WebAppUtils/webAppUtilsStyles.css";

import { fileProps } from './file.interface';
import FileViewer from './ViewFile.tsx';

const FileIcon: React.FC<fileProps> = ({ 
    fileName, 
    fileId, 
    path, 
    fileSize, 
    folderId, 
    createdAt, 
    updatedAt,
    fileAuthor,
    fileExtension,
    mimeType
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = async () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isModalOpen]);

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isModalOpen) {
                handleCloseModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isModalOpen]);

    return (
        <>
            <div className='item-box' onClick={handleClick}>
                <i className="fa-solid fa-file fa-6x"></i>
                <strong className='item-name'>{fileName}</strong>
            </div>
            
            {isModalOpen && (
                <div className='search-window-overlay' onClick={handleCloseModal}>
                    <div 
                        className='search-window-container file-viewer-modal' 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='search-window-header'>
                            <h5 className='mb-0' title={fileName}>{fileName}</h5>
                            <button 
                                className='btn btn-sm btn-secondary' 
                                onClick={handleCloseModal}
                            >
                                ✕ Close
                            </button>
                        </div>
                        <div className='search-window-content'>
                            {path ? (
                                <FileViewer 
                                    fileUrl={path}
                                    fileType={mimeType}
                                    fileName={fileName}
                                />
                            ) : (
                                <div className='loading-state'>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className='mt-3'>Loading file...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default FileIcon