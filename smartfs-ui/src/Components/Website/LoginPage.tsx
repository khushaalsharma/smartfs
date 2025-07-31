import React, { useState } from 'react';
import {getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import app from '../../Firebase/firebase.config.ts';

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
                console.log(credentials.user);
                alert('sign in successful');
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

                console.log(token, result.user);
                alert("sign in by google done");
            })
            .catch((error) => {
                console.log("error in logging in using Google: " + error);
            })
    }

    return (
        <div>
            <div>
                <h4>SIGN IN</h4>
                <form>
                    <input name='email' type='email' value={userDate.email} placeholder='Email' onChange={handleChange}/>
                    <input name='password' type='password' value={userDate.password} placeholder='Password' onChange={handleChange}/>
                    <button onClick={loginByPassword}>Sign In</button>

                    <button onClick={loginByGoogle}>Sign In using Google</button>
                    <button onClick={() => {window.location.href = "/signup"}}>Don't have an account? Sign Up here</button>
                </form>
            </div>
        </div>
    )
}

export default LogInPage;
