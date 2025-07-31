import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import "./websiteStyles.css";

const WebsiteHeader = () => {
    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">SmartFS</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse auth-navbar-div" id="navbarSupportedContent">
                        <div className='d-flex me-auto mb-2 mb-lg-0'>
                            <button className='btn btn-primary' onClick={() => {window.location.href = "/signin"}}>Sign In</button>
                            <button className='btn btn-outline-primary' onClick={() => {window.location.href = "/signup"}}>Sign up</button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default WebsiteHeader
