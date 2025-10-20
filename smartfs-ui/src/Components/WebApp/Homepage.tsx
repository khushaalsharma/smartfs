import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./homepageStyles.css";

import WebAppHeader from "./WebAppUtils/WebAppHeader.tsx";
import Sidebar from "./WebAppUtils/Sidebar.tsx";
import ContentPage from "./MainContent/ContentPage.tsx";
import FileUploadDiv from "./WebAppUtils/FileUploadDiv.tsx";
import NewFolderDialog from "./WebAppUtils/NewFolderDialog.tsx";

const Homepage = () => {
    const [fileDialog, setFileDialog] = useState(false);
    const [folderDialog, setFolderDialog] = useState(false);

    const openFileDialog = (newFileDialog: boolean) => {
        setFileDialog(newFileDialog);
    }

    const openFolderDialog = (newFolderDialog: boolean) => {
        setFolderDialog(newFolderDialog);
    }

    return (
        <>
            <WebAppHeader />
            <div className="d-flex">
                <Sidebar openFileDialog={openFileDialog} openFolderDialog={openFolderDialog} />
                <div className="flex-grow-1 p-3 main-content">
                    <ContentPage />
                    {fileDialog && <FileUploadDiv openFileDialog={openFileDialog} />}{folderDialog && <NewFolderDialog changeFolderDialogState={openFolderDialog} />}
                </div>
            </div>
        </>
    );
}

export default Homepage;