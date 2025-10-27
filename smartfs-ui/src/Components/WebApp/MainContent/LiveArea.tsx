import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "./contentPageStyles.css";

import FileIcon from './FileIcon.tsx';
import FolderIcon from './FolderIcon.tsx';

import { fileProps } from './file.interface.ts';
import { folderProps } from './folder.interface.ts';

interface LiveAreaProps {
  curr: string;
  onFolderClick: (folderId: string, folderName: string) => void;
}

type Item =
  | ({ type: "folder" } & folderProps)
  | ({ type: "file" } & fileProps);

const LiveArea: React.FC<LiveAreaProps> = ({ curr, onFolderClick }) => {
  const [folderList, setFolderList] = useState<folderProps[]>([]);
  const [fileList, setFileList] = useState<fileProps[]>([]);
  const [mergedList, setMergedList] = useState<Item[]>([]);

  useEffect(() => {
    fetchFoldersAndFiles();
  }, [curr]);

  useEffect(() => {
    const combined: Item[] = [
      ...folderList.map(f => ({ ...f, type: "folder" as const })),
      ...fileList.map(f => ({ ...f, type: "file" as const }))
    ];
    setMergedList(combined);
  }, [folderList, fileList]);

  const fetchFoldersAndFiles = async () => {
    let cache: Record<string, { folders: folderProps[]; files: fileProps[] }> = {};
    const cacheStr = localStorage.getItem("filesFolderMap");
    const userId = JSON.parse(sessionStorage.getItem("smartFsUser") || "{}").id;

    if (!userId) {
      console.error("No user session found.");
      return;
    }

    // Load cache
    if (cacheStr) {
      try {
        cache = JSON.parse(cacheStr);
      } catch (e) {
        console.error("Invalid cache:", e);
      }
    }

    // If cached, use it
    if (curr && cache[curr]) {
      console.log("Using cached data for folder:", curr);
      setFolderList(cache[curr].folders);
      setFileList(cache[curr].files);
      return;
    }

    // Otherwise, fetch fresh data
    try {
      const [folderRes, fileRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_SERVER_URL}/folder/subfolders/${userId}`, {
          params: { parentId: curr === "root" ? null : curr },
        }),
        axios.get(`${process.env.REACT_APP_SERVER_URL}/file/all/${userId}`, {
          params: { folderId: curr === "root" ? null : curr },
        }),
      ]);

      const folders = folderRes.data as folderProps[];
      const files = fileRes.data as fileProps[];

      setFolderList(folders);
      setFileList(files);

      // Update cache
      cache[curr] = { folders, files };
      localStorage.setItem("filesFolderMap", JSON.stringify(cache));

      console.log("Cache updated for folder:", curr);
    } catch (error) {
      console.error("Error fetching folder or file data:", error);
    }
  };

  const handleFolderClick = (folderItem: folderProps) => {
    console.log("Folder clicked:", folderItem.folder_id);
    onFolderClick(folderItem.folder_id.toString(), folderItem.folder_name);
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
                key={`folder-${item.folder_id}`}
                onClick={() => handleFolderClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <FolderIcon {...item} />
              </div>
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
