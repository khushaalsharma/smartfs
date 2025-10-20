import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "./contentPageStyles.css";

import FileIcon from './FileIcon.tsx';
import FolderIcon from './FolderIcon.tsx';

import { fileProps } from './file.interface.ts';
import { folderProps } from './folder.interface.ts';

interface LiveAreaProps {
  parent: string;
  curr: string;
  path: string;
}

type Item = 
  | ({ type: "folder" } & folderProps)
  | ({ type: "file" } & fileProps);

const LiveArea: React.FC<LiveAreaProps> = ({ parent, curr, path }) => {
  const [folderList, setFolderList] = useState<folderProps[]>([]);
  const [fileList, setFileList] = useState<fileProps[]>([]);
  const [mergedList, setMergedList] = useState<Item[]>([]);

  useEffect(() => {
    fetchFoldersAndFiles();
  }, [curr]);

  useEffect(() => {
    // Combine both into one array
    const combined: Item[] = [
      ...folderList.map(f => ({ ...f, type: "folder" as const })),
      ...fileList.map(f => ({ ...f, type: "file" as const }))
    ];
    setMergedList(combined);
  }, [folderList, fileList]);

  const fetchFoldersAndFiles = async () => {
    let filesFolderMap: Record<string, { folders: folderProps[]; files: fileProps[] }> = {};

    const filesFolderMapStr = localStorage.getItem("filesFolderMap");
    const sessionData = sessionStorage.getItem("smartFsUser");
    const userId = sessionData ? JSON.parse(sessionData).id : null;

    if (!userId) {
      console.error("No user session found.");
      return;
    }

    // Load existing cache (if any)
    if (filesFolderMapStr) {
      try {
        filesFolderMap = JSON.parse(filesFolderMapStr);
      } catch (err) {
        console.error("Invalid JSON in filesFolderMap:", err);
      }
    }

    // If cached data for current folder exists, use it
    if (filesFolderMap[curr]) {
      console.log("Using cached data for folder:", curr);
      const { folders, files } = filesFolderMap[curr];
      setFolderList(folders);
      setFileList(files);
      return;
    }

    // Otherwise, fetch from API and update cache
    try {
      const [folderRes, fileRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_SERVER_URL}/folder/subfolders/${userId}`, {
          params: { parentId: curr },
        }),
        axios.get(`${process.env.REACT_APP_SERVER_URL}/file/all/${userId}`, {
          params: { folderId: curr },
        }),
      ]);

      const folders = folderRes.data as folderProps[];
      const files = fileRes.data as fileProps[];

      setFolderList(folders);
      setFileList(files);

      // Update cache
      filesFolderMap[curr] = { folders, files };
      localStorage.setItem("filesFolderMap", JSON.stringify(filesFolderMap));

      console.log("Cache updated for folder:", curr);
    } catch (error) {
      console.error("Error fetching folder or file data:", error);
    }
  };


  return (
    <div className="live-area">
      {mergedList.length === 0 ? (
        <h5>Your folder is empty</h5>
      ) : (
        <div className="live-grid">
          {mergedList.map((item) =>
            item.type === "folder" ? (
              <FolderIcon key={`folder-${item.folder_id}`} {...item} />
            ) : (
              <FileIcon key={`file-${item.file_id}`} {...item} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default LiveArea;
