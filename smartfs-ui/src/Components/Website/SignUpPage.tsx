import React, { useState } from 'react';
import {getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import app from '../../Firebase/firebase.config.ts';

const SignUpPage = () => {

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

        createUserWithEmailAndPassword(auth, userDate.email, userDate.password)
            .then((userCredentials) => {
                //signed in
                alert("sign up complete, logging in");
                console.log(userCredentials);
                //setAuthToken(userCredentials.providerId);
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
                console.log(result?.providerId, result?.user.getIdToken);
                alert("sign in complete");
            })
            .catch((error) => {
                console.error(error);
            })
    }

    return (
        <div>
            <div>
                <h4>SIGN UP</h4>
                <form>
                    <input name='email' type='email' value={userDate.email} placeholder='Email' onChange={handleChange}/>
                    <input name='password' type='password' value={userDate.password} placeholder='Password' onChange={handleChange}/>
                    <button onClick={loginByPassword}>Sign Up</button>

                    <button onClick={signUpByGoogle}>Sign Up using Google</button>
                    <button onClick={() => {window.location.href = "/signin"}}>Already have an account? Sign In here</button>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage;
