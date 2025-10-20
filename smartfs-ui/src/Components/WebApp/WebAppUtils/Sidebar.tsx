import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./webAppUtilsStyles.css";

interface SidebarProps {
    openFileDialog: (newFileDialog: boolean) => void;
    openFolderDialog: (newFileDialog: boolean) => void;
}

export default function Sidebar({ openFileDialog, openFolderDialog }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
     <>
      {/* Sidebar */}
      <div className={`sidebar bg-light ${isOpen ? "open" : ""}`}>
        <button
          className="btn btn-link text-start w-100 d-lg-none"
          onClick={() => setIsOpen(false)}
        >
          ✖ Close
        </button>
        <ul className="list-unstyled mt-3">
          <li className="sidebar-btn">
            <button className="btn btn-success btn-upload" onClick={() => openFileDialog(true)}>+ Upload File</button>
          </li>
          <li className="sidebar-btn" onClick={() => {openFolderDialog(true)}}>
            New Folder
          </li>
          <li className="sidebar-btn">
            Profile
          </li>
          <li className="sidebar-btn">
            Logout
          </li>
        </ul>
      </div>

      {/* Floating toggle button (visible only on small screens) */}
      <button
        className="btn btn-primary sidebar-toggle-btn d-lg-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
    </>
  );
}
