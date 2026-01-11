import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./contentPageStyles.css";
import LiveArea from './LiveArea.tsx';

interface PathItem {
  id: string;
  name: string;
}

const ContentPage = () => {
  const [currPath, setCurrPath] = useState("root");
  const [curr, setCurr] = useState<string>("root");
  const [pathStack, setPathStack] = useState<PathItem[]>([{ id: "root", name: "root" }]);

  const handleBack = () => {
    if (pathStack.length > 1) {
      const newStack = [...pathStack];
      newStack.pop(); // remove current folder
      const previousFolder = newStack[newStack.length - 1];
      setPathStack(newStack);
      setCurr(previousFolder.id);
      setCurrPath(newStack.map(item => item.name).join("/"));
    }
  };

  const handleFolderClick = (folderId: string, folderName: string) => {
    const newStack = [...pathStack, { id: folderId, name: folderName }];
    setPathStack(newStack);
    setCurr(folderId);
    setCurrPath(newStack.map(item => item.name).join("/"));
  };

  return (
    <>
      <div className='row folder-div'>
        <div className='col-md-10 folder-path'>
          {currPath}
        </div>
        <div className='col-md-2'>
          <button
            className='btn btn-light'
            disabled={curr === "root"}
            onClick={handleBack}
          >
            🔙
          </button>
        </div>
      </div>

      <LiveArea
        curr={curr}
        onFolderClick={handleFolderClick}
      />
    </>
  );
};

export default ContentPage;
