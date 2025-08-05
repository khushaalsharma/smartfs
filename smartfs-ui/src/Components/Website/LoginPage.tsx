import React, { useState } from 'react';
import {getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import app from '../../Firebase/firebase.config.ts';

//CSS
import "bootstrap/dist/css/bootstrap.css";
import "./websiteStyles.css";
import WebsiteHeader from './WebsiteHeader.tsx';

const LogInPage = () => { 

    const [userDate, setUserData] = useState({
        email : "",
        password: ""
    });

    const [authToken, setAuthToken] = useState("");

    function handleChange(e){
        e.preventDefault();

        const {name, value} = e.target;
        setUserData({...userDate, [name]: value});
    }

    function loginByPassword(e){
        e.preventDefault();
        const auth = getAuth(app);

        signInWithEmailAndPassword(auth, userDate.email, userDate.password)
            .then((credentials) => {
                let user = credentials.user;

                user.getIdToken()
                    .then((token) => {
                        const userData = {
                            token: token,
                            email: user.email,
                            username: user.displayName,
                            photo: user.photoURL
                        }

                        sessionStorage.setItem("smartFsUser", JSON.stringify(userData));
                        alert("sign in complete");
                        window.location.href = "/home";
                    })
                    .catch((error) => {
                        console.log("can't fetch the token: ", error);
                    })
            })
            .catch((error) => {
                alert("can't login");
                console.log("Error in signing in using email password: " + error);
            })
    }

    function loginByGoogle(e){
        e.preventDefault();
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result.user;

                const sessionData = {
                    token: result.user.getIdToken(false),
                    username: user.displayName,
                    email: user.email,
                    photo: user.photoURL
                }

                sessionStorage.setItem("smartFsUser", JSON.stringify(sessionData));

                //console.log(token, result.user);
                alert("sign in by google done");
                window.location.href = "/home";
            })
            .catch((error) => {
                alert("Can't login by Google right now");
                console.log("error in logging in using Google: " + error);
            })
    }

    return (
        <>
            <WebsiteHeader/>
            <div>
                <div className='authDiv'>
                    <h4>SIGN IN</h4>
                    <input className='authInput' name='email' type='email' value={userDate.email} placeholder='Email' onChange={handleChange}/>
                    <input className='authInput' name='password' type='password' value={userDate.password} placeholder='Password' onChange={handleChange}/>
                    <button className='btn btn-primary' onClick={loginByPassword}>Sign In</button>
                    OR
                    <button className='btn btn-outline-primary btn-auth' onClick={loginByGoogle}>Sign In using Google</button>
                    <button className='btn btn-outline-dark btn-auth' onClick={() => {window.location.href = "/signup"}}>Don't have an account? Sign Up here</button>
                </div>
            </div>
        </>
    )
}

export default LogInPage;
