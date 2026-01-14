import React, { use, useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./webAppUtilsStyles.css";
import axios from 'axios';
import { getValidToken, getUserData } from '../../../Utils/tokenUtils.ts';

interface FolderDivProps {
    changeFolderDialogState: (newFileDialog: boolean) => void;
}

const NewFolderDialog = ({changeFolderDialogState}: FolderDivProps) => {

    const [folderName, setFolderName] = useState<string>("");
    const [parentFolderId, setParentFolderId] = useState<number | null>(null);
    const [folders, setFolders] = useState<Map<number, string>>(new Map());
    const [userId, setUserId] = useState<string | null>(null);

    const getAllFolders = async() => {
        const userData = getUserData();
        if (!userData || !userData.id) {
            console.error("User ID not found");
            return;
        }

        const userId = userData.id;
        setUserId(userId);

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
                folderData.forEach((folderItem: any) => {
                    folderMap.set(folderItem.folderId, folderItem.folderName);
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
        let currentUserId = userId;
        if(!currentUserId){
            const userData = getUserData();
            if (!userData || !userData.id) {
                console.error("User ID not found");
                return;
            }
            currentUserId = userData.id;
            setUserId(currentUserId);
        }

        // Get valid token (automatically refreshes if expired)
        let validToken: string;
        try {
            validToken = await getValidToken();
        } catch (error) {
            console.error("Error getting valid token:", error);
            return;
        }

        try{
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/folder/new`, 
                {
                    folderName: folderName,
                    folderOwner: currentUserId,
                    parentId: parentFolderId === 0 ? null : {
                        folderId: parentFolderId
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${validToken}`
                    }
                }
            ).then((response) => {
                console.log("Folder created successfully: ", response.data);

                //update the cache 
                const cache = JSON.parse(localStorage.getItem("filesFolderMap") || "{}");
                if(cache !== null && parentFolderId !== null && cache[parentFolderId.toString()]){
                    cache[parentFolderId.toString()].folders.push(response.data);
                }else if(cache && parentFolderId === null){
                    cache["root"].folders.push(response.data);
                }

                localStorage.setItem("filesFolderMap", JSON.stringify(cache));
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
