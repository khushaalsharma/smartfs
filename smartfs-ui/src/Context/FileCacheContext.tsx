import React, { useState, createContext, useContext, Children, useCallback } from "react";
import { fileProps } from "../Components/WebApp/MainContent/file.interface";
import { folderProps } from "../Components/WebApp/MainContent/folder.interface";

type CacheEntry = {folders: folderProps[], files: fileProps[]};
type Cache = Record<string, CacheEntry>;

interface FileCacheContextType{
    cache: Cache | undefined;
    updateCache: (folderId: string, data: CacheEntry) => void;
    appendFile: (folderId: string | null, file: fileProps) => void;
    appendFolder: (folderId: number | null, folder: folderProps) => void;
    invalidate: (folderId: string | null) => void;
    clearCache: () => void;
}

const FileCacheContext = createContext<FileCacheContextType | null>(null);

export const FileCacheProvider = ({children} : {children: React.ReactNode}) => {
    const [cache, setCache] = useState<Cache | undefined>(() => {
        try{
            return JSON.parse(localStorage.getItem("filesFolderMap") || '{}');
        }catch{
            return {};
        }
    });

    const persist = (next: Cache) => {
        localStorage.setItem("filesFolderMap", JSON.stringify(next));
        return next;
    }

    const updateCache = useCallback((folderId: string, data: CacheEntry) => {
        setCache(prev => persist({...prev, [folderId]: data}));
    }, []);

    const appendFile = useCallback((folderId: string | null , file: fileProps) => {
        const key = folderId ?? 'root';
        setCache(prev => {
            if(prev !== undefined){
                if(!prev[key]) return prev;

                const next = {...prev, [key] : {...prev[key], files: [...prev[key].files, file]}}
                return persist(next);
            }
        });
    }, []);

    const appendFolder = useCallback((folderId: number | null, folder: folderProps) => {
      const key = folderId?.toString() ?? 'root';
      setCache(prev => {
        if(prev !== undefined){
            if (!prev[key]) return prev;
            const next = { ...prev, [key]: { ...prev[key], folders: [...prev[key].folders, folder] } };
            return persist(next);
        }
      });
    }, []);

    const invalidate = useCallback((folderId: string | null) => {
      const key = folderId ?? 'root';
      setCache(prev => {
        const next = { ...prev };
        delete next[key];
        return persist(next);
      });
    }, []);

    const clearCache = useCallback(() => {
      setCache({});
      localStorage.removeItem('filesFolderMap');
    }, []);

    return (
      <FileCacheContext.Provider value={{ cache, updateCache, appendFile, appendFolder, invalidate, clearCache }}>
        {children}
      </FileCacheContext.Provider>
    );
};

export const useFileCache = () => {
    const ctx = useContext(FileCacheContext);
    if (!ctx) throw new Error('useFileCache must be used within FileCacheProvider');
    return ctx;
};