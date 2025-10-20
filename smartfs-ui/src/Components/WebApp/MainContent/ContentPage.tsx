import React, { useState } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import "./contentPageStyles.css";
import LiveArea from './LiveArea.tsx';

const ContentPage = () => {

    const [currPath, setCurrPath] = useState("root");
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);

    return (
        <>
            <div className='row folder-div'>
                <div className='col-md-10 folder-path'>
                    {currPath}
                </div>
                <div className='col-md-2'>
                    <button className='btn btn-light' disabled={currPath === "root"}>🔙</button>
                </div>
            </div>
            <div>
                {/* {(folders.length === 0 && files.length === 0) ? <h5>Your folder is empty</h5> : ""}
                {/* function to get the folders called here}
                function to get files goes here */}

                <LiveArea parent='null' curr='' path={currPath}/>
            </div>
        </>
    )
}

export default ContentPage
