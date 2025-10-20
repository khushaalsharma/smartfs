import React, { use, useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./webAppUtilsStyles.css";

import axios from 'axios';

interface FolderDivProps {
    changeFolderDialogState: (newFileDialog: boolean) => void;
}

const NewFolderDialog = ({changeFolderDialogState}: FolderDivProps) => {

    const [folderName, setFolderName] = useState<string>("");
    const [parentFolderId, setParentFolderId] = useState<number | null>(null);
    const [folders, setFolders] = useState<Map<number, string>>(new Map());
    const [userId, setUserId] = useState<string | null>(null);

    const getAllFolders = async() => {
        const sessionData = sessionStorage.getItem("smartFsUser");
        const userId = sessionData ? JSON.parse(sessionData).id : null;

        setUserId(userId);

        if (!userId) {
            console.error("User ID not found");
            return;
        }

        try{
           const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/folder/all/${userId}`);
            const folderData = response.data;
            let folderMap : Map<number, string> = new Map();
            if(folderData && Array.isArray(folderData)){
                folderData.forEach((folderItem: any) => {
                    folderMap.set(folderItem.folder_id, folderItem.folder_name);
                });
            }

            folderMap.set(0, "No folder");
            setFolders(folderMap);
        }
        catch(err){
            console.error("Error fetching folders: ", err);
        }
    }

    useEffect(() => {
        getAllFolders();
    }, []);

    const handleNewFolder = async() => {
        if(!userId){
            const sessionData = sessionStorage.getItem("smartFsUser");
            const userId = sessionData ? JSON.parse(sessionData).id : null;
            if(!userId){
                console.error("User ID not found");
                return;
            }
            else{
                setUserId(userId);
            }
        }

        try{
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/folder/create`, 
                {
                    folderName: folderName,
                    author: userId,
                    parentId: parentFolderId !== 0 ? parentFolderId : null
                }
            ).then((response) => {
                console.log("Folder created successfully: ", response.data);
                changeFolderDialogState(false);
            }).catch((error) => {
                console.error("Error in folder creation: ", error);
            });
        }
        catch(err){
            console.error("Error creating new folder: ", err);
        }
    }

    return (
        <div>
            <div className='newFolderDialog'>
                <h5>New Folder</h5>
                <input type='text' placeholder='Folder Name' name='folder-name' value={folderName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setFolderName(event.target.value)}}/>
                <label htmlFor='parent-folder'>Parent Folder</label>
                <select id='parent-folder' onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    const newId = Number(event.target.value);
                    setParentFolderId(newId);
                 }}>
                    {
                        Array.from(folders.entries()).map(([id, name]) => {
                            return (
                                <option key={id} value={id}>{name}</option>
                            )
                        })
                    }
                </select>
                <div className='folderDialogButtons'>
                    <button className='btn btn-outline-light' onClick={handleNewFolder}>Create</button>
                    <button className='btn btn-outline-light' onClick={() => {changeFolderDialogState(false)}}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default NewFolderDialog
