import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import "./webAppUtilsStyles.css";

const WebAppHeader = () => {
    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/home">SmartFS</a>
                        <div className="search-div" id="navbarSupportedContent">
                            <div>
                                <input type="text" className="form-control" placeholder="Search files..." style={{width: '300px', display: 'inline-block', marginRight: '10px'}} />
                                <button className='btn btn-success btn-search' onClick={() => {window.location.href = "/signup"}}>Search</button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default WebAppHeader
