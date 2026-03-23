import { useState, createContext, useContext, useEffect} from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import app from "../Firebase/firebase.config.ts";

interface AuthUser{
    id: string;
    email: string | null;
    name: string | null;
    photo: string | null;
    firebaseUser: User
}

interface AuthContextType{
    user: AuthUser | null;
    isLoading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children} : {children: React.ReactNode}) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if(firebaseUser){
                setUser(
                    {
                        id: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName,
                        photo: firebaseUser.photoURL,
                        firebaseUser
                    }
                );
            }else{
                setUser(null);
            }

            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = async() => {
        const auth = getAuth(app);
        await signOut(auth);
        localStorage.removeItem("filesFolderMap");
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, isLoading, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error("useAuth must be within AuthProvider");
    return ctx;
};