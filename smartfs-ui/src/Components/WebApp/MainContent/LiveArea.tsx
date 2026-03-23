import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "./contentPageStyles.css";
import { getValidToken, getUserData } from '../../../Utils/tokenUtils.ts';
import { useAuth } from '../../../Context/AuthContext.tsx';
import { useFileCache } from '../../../Context/FileCacheContext.tsx';
import { useNavigate } from 'react-router-dom';

import FileIcon from './FileIcon.tsx';
import FolderIcon from './FolderIcon.tsx';

import { fileProps } from './file.interface.ts';
import { folderProps } from './folder.interface.ts';

/**
 * Utility function to invalidate cache for a specific folder
 * This can be called when files/folders are created/deleted
 */
export const invalidateFolderCache = (folderId: string | null) => {
  const cacheStr = localStorage.getItem("filesFolderMap");
  if (!cacheStr) return;
  
  try {
    const cache = JSON.parse(cacheStr);
    const cacheKey = folderId || "root";
    delete cache[cacheKey];
    localStorage.setItem("filesFolderMap", JSON.stringify(cache));
    //console.log("Cache invalidated for folder:", cacheKey);
  } catch (e) {
    //console.error("Error invalidating cache:", e);
  }
};

interface LiveAreaProps {
  curr: string;
  onFolderClick: (folderId: string, folderName: string) => void;
}

type Item =
  | ({ type: "folder" } & folderProps)
  | ({ type: "file" } & fileProps);

const LiveArea: React.FC<LiveAreaProps> = ({ curr, onFolderClick }) => {
  const {user} = useAuth();
  const {cache, updateCache} = useFileCache();
  const navigate = useNavigate();

  const [folderList, setFolderList] = useState<folderProps[]>([]);
  const [fileList, setFileList] = useState<fileProps[]>([]);
  const [mergedList, setMergedList] = useState<Item[]>([]);


  const fetchAndUpdateCache = useCallback(async (
    userId: string,
    token: string,
    cacheKey: string,
    cache: Record<string, { folders: folderProps[]; files: fileProps[] }>,
    expectedFolderId: string
  ) => {
    try {
      const [folderRes, fileRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_SERVER_URL}/folder/subFolders/${userId}` + (cacheKey === "root" ? '/0' : `/${cacheKey}`), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        axios.get(`${process.env.REACT_APP_SERVER_URL}/file/byFolder/${userId}` + (cacheKey === "root" ? '/0' : `/${cacheKey}`), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
      ]);

      const folders = folderRes.data as folderProps[];
      const files = fileRes.data as fileProps[];

      // Only update state if we're still on the same folder (prevent race conditions)
      // Check curr prop to ensure we haven't navigated away
      const currentFolderId = curr || "root";
      if (currentFolderId === expectedFolderId) {
        setFolderList(folders);
        setFileList(files);
        //console.log("Updated UI for folder:", expectedFolderId);
      } else {
        //console.log("Skipping state update - folder changed from", expectedFolderId, "to", currentFolderId);
      }

      // Always update cache regardless of current folder (cache is shared)
      updateCache(cacheKey, {files, folders});

      //console.log("Cache updated for folder:", cacheKey);
    } catch (error) {
      //console.error("Error fetching folder or file data:", error);
      // If fetch fails and we have cache, keep using cache
      if (cache[cacheKey]) {
        //console.log("Fetch failed, keeping cached data");
      }
    }
  }, [curr]);

  const fetchFoldersAndFiles = useCallback(async (folderId: string) => {
    // Ensure we're fetching for the correct folder
    const currentFolderId = folderId || "root";
    //console.log("Fetching folders and files for:", currentFolderId);
    
    if(!user) return;
    const userId = user.id;
    
    // Get valid token (automatically refreshes if expired)
    let token: string;
    try {
      token = await getValidToken(navigate);
    } catch (error) {
      //console.error("Error getting valid token:", error);
      return;
    }

    if(cache !== undefined){
      // Check if we have cached data for the current folder
    if (cache[currentFolderId]?.folders && cache[currentFolderId]?.files) {
      //console.log("Using cached data for folder:", currentFolderId);
      // Show cached data immediately for instant UI
      setFolderList(cache[currentFolderId].folders);
      setFileList(cache[currentFolderId].files);
      
      // Fetch fresh data in background to update cache and UI if data changed
      // This ensures cache stays fresh while providing instant UI updates
      fetchAndUpdateCache(userId, token, currentFolderId, cache, currentFolderId).catch(err => {
        //console.error("Background fetch failed:", err);
      });
    } else {
      // No cache available, fetch fresh data
      await fetchAndUpdateCache(userId, token, currentFolderId, cache, currentFolderId);
    }
    }
  }, [fetchAndUpdateCache, user, cache]);

  useEffect(() => {
    // Clear previous folder/file lists when curr changes to prevent showing stale data
    setFolderList([]);
    setFileList([]);
    
    // Fetch data for the current folder
    const currentFolderId = curr || "root";
    fetchFoldersAndFiles(currentFolderId);
  }, [curr, fetchFoldersAndFiles]);

  useEffect(() => {
    const combined: Item[] = [
      ...folderList.map(f => ({ ...f, type: "folder" as const })),
      ...fileList.map(f => ({ ...f, type: "file" as const }))
    ];
    setMergedList(combined);
  }, [folderList, fileList]);


  const handleFolderClick = (folderItem: folderProps) => {
    //console.log("Folder clicked:", folderItem.folderId);
    onFolderClick(folderItem.folderId.toString(), folderItem.folderName);
  };

  return (
    <div className="live-area">
      {mergedList.length === 0 ? (
        <h5>Your folder is empty</h5>
      ) : (
        <div className="live-grid">
          {mergedList.map((item) =>
            item.type === "folder" ? (
              <div
                key={`folder-${item.folderId}`}
                onClick={() => handleFolderClick(item)}
                style={{ cursor: 'pointer' }}
                className='folder-box'
              >
                <FolderIcon {...item} />
              </div>
            ) : (
              <FileIcon key={`file-${item.fileId}`} {...item} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default LiveArea;
