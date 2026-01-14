import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./webAppUtilsStyles.css";
import axios from 'axios';
import { getValidToken, getUserData } from '../../../Utils/tokenUtils.ts';

import { fileProps } from '../MainContent/file.interface';

interface FileUploadDivProps {
    openFileDialog: (newFileDialog: boolean) => void;
}

const FileUploadDiv = ({ openFileDialog }: FileUploadDivProps) => {
    const [folders, setFolders] = useState<Map<number, string>>(new Map());
    const [folder_id, setFolderId] = useState<number | null>(null); // null means root
    const [file, setFile] = useState<File | null>(null);

    const getFoldersForDropDown = async () => {
        const userData = getUserData();
        if (!userData || !userData.id) {
            console.error("No user session found.");
            return;
        }

        const userId = userData.id;
        
        // Get valid token (automatically refreshes if expired)
        let token: string;
        try {
            token = await getValidToken();
        } catch (error) {
            console.error("Error getting valid token:", error);
            return;
        }

        try{
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/folder/all/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const folderData = response.data;
            let folderMap : Map<number, string> = new Map();
            if(folderData && Array.isArray(folderData)){
                folderMap = new Map(folderData.map((folder: any) => [folder.folderId, folder.folderName]));
            }

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
        // Reset state when dialog opens
        setFolderId(null); // Default to root
        setFile(null);
        getFoldersForDropDown();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files && event.target.files.length > 0){
            console.log(event.target.files);
            setFile(event.target.files[0]);
            console.log("file selected:", event.target.files[0].name);
        }
    } 

    const handleFileUpload = async () => {
        if (!file) {
            window.alert("No file selected.");
            return;
        }

        const userData = getUserData();
        if (!userData || !userData.id) {
            window.alert("No user session found.");
            return;
        }

        // Get valid token (automatically refreshes if expired)
        let token: string;
        try {
            token = await getValidToken();
        } catch (error) {
            console.error("Error getting valid token:", error);
            window.alert("Authentication error. Please sign in again.");
            return;
        }

        const formData = new FormData();

        // Append the file
        formData.append("file", file);

        // Append the metadata as a JSON string
        // API expects: { folderId: { folderId: <number> }, authorId: <string> }
        // If folder_id is null, it means root (send null for folderId)
        // If folder_id is a number, send it as { folderId: { folderId: <number> } }
        const payloadData: any = {
            authorId: userData.id
        };
        
        if (folder_id !== null && folder_id !== 0) {
            payloadData.folderId = {
                parentId: {
                    folderId: folder_id
                }
            };
        } else {
            payloadData.parentId = null;
        }
        
        console.log("Uploading file with payload:", JSON.stringify(payloadData), "folder_id state:", folder_id);

        formData.append("data", JSON.stringify(payloadData));

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/file/new`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    },
                }
            );

            window.alert("File uploaded successfully.");
            // Reset state after successful upload
            //update the cache
            const filesCache = JSON.parse(localStorage.getItem("filesFolderMap") || "{}");
            if(filesCache !== null && folder_id !== null &&filesCache[folder_id?.toString()]){
                filesCache[folder_id.toString()].files.push(response.data);
            }else if(filesCache && folder_id === null){
                filesCache["root"].files.push(response.data);
            }

            localStorage.setItem("filesFolderMap", JSON.stringify(filesCache));
            setFile(null);
            setFolderId(null);
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
            <select 
                id="folder-id" 
                name="folder_id" 
                value={folder_id === null ? "root" : folder_id.toString()}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const value = e.target.value;
                    if (value === "root" || value === "") {
                        setFolderId(null);
                    } else {
                        const numValue = parseInt(value, 10);
                        setFolderId(isNaN(numValue) ? null : numValue);
                    }
                    console.log("Folder selected:", value, "folder_id set to:", value === "root" || value === "" ? null : parseInt(value, 10));
                }}
            >
                <option value="root">Root</option>
                {
                    folders.size > 0 ? 
                    Array.from(folders.entries()).map(([id, name]) => {
                        return <option key={id} value={id}>{name}</option>;
                    })
                    : null
                }
            </select>
            <button className="upload-button" onClick={handleFileUpload}>Upload</button>
            <button className="btn cancel-button btn-outline-danger" onClick={closeDialog}>Cancel</button>
        </div>
    )
}

export default FileUploadDiv
