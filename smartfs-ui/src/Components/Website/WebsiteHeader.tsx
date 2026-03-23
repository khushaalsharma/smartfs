import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import "./websiteStyles.css";
import { useNavigate } from 'react-router-dom';

const WebsiteHeader = () => {
    const navigate = useNavigate();
    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">SmartFS</a>
                    <div className="auth-navbar-div" id="navbarSupportedContent">
                        <div>
                            <button className='btn btn-primary btn-login' onClick={() => {navigate("/signin")}}>Sign In</button>
                            <button className='btn btn-outline-primary btn-signup' onClick={() => {navigate("/signup")}}>Sign up</button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default WebsiteHeader
