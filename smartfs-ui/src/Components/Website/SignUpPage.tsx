import React, { useState } from 'react';
import {getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import app from '../../Firebase/firebase.config.ts';

//CSS
import "bootstrap/dist/css/bootstrap.css";
import "./websiteStyles.css";
import WebsiteHeader from './WebsiteHeader.tsx';

const SignUpPage = () => {

    const [userDate, setUserData] = useState({
        name: "",
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

        createUserWithEmailAndPassword(auth, userDate.email, userDate.password)
            .then((userCredentials) => {
                let user = userCredentials.user;

                user.getIdToken()
                    .then((token) => {
                        const userData = {
                            token: token,
                            email: user.email,
                            username: user.displayName,
                            photo: user.photoURL
                        }

                        sessionStorage.setItem("smartFsUser", JSON.stringify(userData));
                        alert("sign up complete");
                        window.location.href = "/signin";
                    })
                    .catch((error) => {
                        console.log("can't fetch the token: ", error);
                    })
            })
            .catch((error) => {
                alert("signup failed")
                console.log("error in firebase login by password: " + error);
            })
    }

    function signUpByGoogle(e){
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
                alert("sign up by google done");
                window.location.href = "/home";
            })
            .catch((error) => {
                console.error(error);
            })
    }

    return (
        <>
            <WebsiteHeader/>
            <div>
                <div className='authDiv'>
                    <h4>SIGN UP</h4>
                    <input className='authInput' name='name' type='name' value={userDate.name} placeholder='Name' onChange={handleChange}/>
                    <input className='authInput' name='email' type='email' value={userDate.email} placeholder='Email' onChange={handleChange}/>
                    <input className='authInput' name='password' type='password' value={userDate.password} placeholder='Password' onChange={handleChange}/>
                    <button className='btn btn-primary' onClick={loginByPassword}>Sign Up</button>
                    OR
                    <button className='btn btn-outline-primary btn-auth' onClick={signUpByGoogle}>Sign Up using Google</button>
                    <button className='btn btn-outline-dark btn-auth' onClick={() => {window.location.href = "/signin"}}>Already have an account? Sign In here</button>
                </div>
            </div>
        </>
    )
}

export default SignUpPage;
