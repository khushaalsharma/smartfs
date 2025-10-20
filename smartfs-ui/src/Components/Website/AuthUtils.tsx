import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../Firebase/firebase.config.ts";

const authApp = getAuth(app);

export function monitorAuthState(){
    return new Promise((resolve) => {
        onAuthStateChanged(authApp, async(user) => {
            if(user){
                const token = await user.getIdToken();
                const userData = {
                    token: token,
                    email: user.email,
                    username: user.displayName,
                    photo: user.photoURL
                }
                resolve({valid : true, data: userData});
            }else{
                resolve({valid : false, data: null});
            }
        });
    });
}