import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import app from "../../../Firebase/firebase.config.ts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./webAppUtilsStyles.css";
import { useAuth } from "../../../Context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
    openFileDialog: (newFileDialog: boolean) => void;
    openFolderDialog: (newFileDialog: boolean) => void;
}

export default function Sidebar({ openFileDialog, openFolderDialog }: SidebarProps) {
  const {logout} = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (error) {
      //console.error("Error signing out: ", error);
      navigate("/signin");
    }
  };

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
          <li className="sidebar-btn" onClick={handleLogout} style={{ cursor: 'pointer' }}>
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
