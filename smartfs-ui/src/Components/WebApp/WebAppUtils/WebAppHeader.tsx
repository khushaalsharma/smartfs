import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import "./webAppUtilsStyles.css";
import { fileProps } from '../MainContent/file.interface.ts';
import axios from 'axios';
import { getValidToken, getUserData } from '../../../Utils/tokenUtils.ts';
import FileIcon from '../MainContent/FileIcon.tsx';

const WebAppHeader = () => {
    const [searchWindowVisible,setSearchWindowVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchedFiles, setSearchedFiles] = useState<fileProps[]>([]);

    const toggleSearchWindow = () => {
        if(searchWindowVisible){
            setSearchedFiles([]);
        }
        setSearchWindowVisible(!searchWindowVisible);
    }

    const search = async() => {
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

        console.log("searched query: " + searchQuery);
        toggleSearchWindow();

        try{
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/file/search`, {
                authorId: userId,
                queryString: searchQuery
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response != null){
                if(Array.isArray(response.data)){
                    setSearchedFiles(response.data);
                }else{
                    console.error(response.data);
                    setSearchedFiles([]);
                }
            }
        }catch(e){
            console.log(e);
        }
    }

    
    const searchWindow = () => {
        return (
            <div className='search-window-overlay' onClick={toggleSearchWindow}>
                <div className='search-window-container' onClick={(e) => e.stopPropagation()}>
                    <div className='search-window-header'>
                        <h5 className='mb-0'>Search Results for "{searchQuery}"</h5>
                    </div>
                    <div className='search-window-content'>
                        <div className='search-grid'>
                            {searchedFiles.length !== 0 ? 
                                searchedFiles.map((item) => (
                                    <FileIcon key={`file-${item.fileId}`} {...item}/>
                                ))
                                : <h4>No files found 😑</h4>
                            }
                        </div>
                    </div>
                    <div className='search-window-footer'>
                        <button className='btn btn-danger' onClick={toggleSearchWindow}>Close</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/home">SmartFS</a>
                        <div className="search-div" id="navbarSupportedContent">
                            <div>
                                <input type="text" className="form-control" placeholder="Search files..." style={{width: '300px', display: 'inline-block', marginRight: '10px'}} value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}}/>
                                <button className='btn btn-success btn-search' onClick={search}>Search</button>  
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            {searchWindowVisible ? searchWindow() : ''}
        </>
    )
}

export default WebAppHeader
