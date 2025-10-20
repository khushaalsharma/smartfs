import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import "./websiteStyles.css";

const WebsiteHeader = () => {
    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">SmartFS</a>
                    <div className="auth-navbar-div" id="navbarSupportedContent">
                        <div>
                            <button className='btn btn-primary btn-login' onClick={() => {window.location.href = "/signin"}}>Sign In</button>
                            <button className='btn btn-outline-primary btn-signup' onClick={() => {window.location.href = "/signup"}}>Sign up</button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default WebsiteHeader
