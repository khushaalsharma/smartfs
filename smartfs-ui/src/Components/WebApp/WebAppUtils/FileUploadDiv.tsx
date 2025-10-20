import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./webAppUtilsStyles.css";
import axios from 'axios';

import { fileProps } from '../MainContent/file.interface';

interface FileUploadDivProps {
    openFileDialog: (newFileDialog: boolean) => void;
}

const FileUploadDiv = ({ openFileDialog }: FileUploadDivProps) => {
    const [folders, setFolders] = useState<Map<number, string>>(new Map());
    const [folder_id, setFolderId] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const getFoldersForDropDown = async () => {
        const sessionData = sessionStorage.getItem("smartFsUser");
        const userId = sessionData ? JSON.parse(sessionData).id : null;

        try{
            if(!userId) {
                console.error("No user session found.");
                return;
            }

            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/folder/all/${userId}`);
            const folderData = response.data;
            let folderMap : Map<number, string> = new Map();
            if(folderData && Array.isArray(folderData)){
                folderMap = new Map(folderData.map((folder: any) => [folder.folder_id, folder.folder_name]));
            }

            folderMap.set(0, "No folder");
            setFolders(folderMap);

        }catch(err){
            console.error("Error fetching folders: ", err);
        }
    }

    const closeDialog = () => {
        // Logic to close the dialog
        openFileDialog(false);
    }

    useEffect(() => {
        getFoldersForDropDown();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files && event.target.files.length > 0){
            console.log(event.target.files);
            setFile(event.target.files[0]);
            console.log("file selected: " + file);
        }
    } 

    const handleFileUpload = async () => {
        if (!file) {
            window.alert("No file selected.");
            return;
        }

        const user = JSON.parse(sessionStorage.getItem("smartFsUser") || "{}");
        const formData = new FormData();

        // Append the file and metadata
        formData.append("file", file);
        formData.append("userId", user.id);
        if(folder_id !== null){
            formData.append("parent", folder_id.toString());
        }else{
            formData.append("parent", "null"); // Default to root if no folder selected
        }

        try {
            const response = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/file/upload`,
            formData,
            {
                headers: {
                "Content-Type": "multipart/form-data",
                },
            }
            );

            window.alert("File uploaded successfully.");
            openFileDialog(false);
        } catch (error) {
            console.error("Error uploading file:", error);
            window.alert("Error uploading file.");
        }
    };


    return (
        <div className="file-upload-div">
            <input type="file" className="file-input" id='file-upload' onChange={handleFileChange} />
            <label htmlFor="file-upload" className="upload-label">Choose File</label>
            <label htmlFor="folder-id">Folder:</label>
            <select id="folder-id" name="folder_id" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {setFolderId(e.target.value as unknown as number)}}>
                {
                    folders.size > 0 ? 
                    Array.from(folders.entries()).map(([id, name]) => {
                        if(name !== "No folder"){
                            return <option key={id} value={id}>{name}</option>;
                        } else {
                            return <option key={id} value={0}>No Folder</option>;
                        }
                    })
                    : <option value="root">No Folders Available</option>
                }
            </select>
            <button className="upload-button" onClick={handleFileUpload}>Upload</button>
            <button className="btn cancel-button btn-outline-danger" onClick={closeDialog}>Cancel</button>
        </div>
    )
}

export default FileUploadDiv
