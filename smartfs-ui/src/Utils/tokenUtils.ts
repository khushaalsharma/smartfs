import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import app from "../Firebase/firebase.config.ts";

/**
 * Gets a valid Firebase authentication token.
 * Automatically refreshes the token if it's expired.
 * Updates sessionStorage with the fresh token.
 * 
 * @returns Promise<string> - A valid Firebase ID token
 * @throws Error if user is not authenticated
 */
export async function getValidToken(): Promise<string> {
  const auth = getAuth(app);
  
  // First check if user is already available
  let user = auth.currentUser;
  
  // If user is not immediately available, wait for auth state to initialize
  if (!user) {
    user = await new Promise<User>((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        unsubscribe();
        if (authUser) {
          resolve(authUser);
        } else {
          reject(new Error("User is not authenticated"));
        }
      });
      
      // Timeout after 5 seconds if auth state doesn't change
      setTimeout(() => {
        unsubscribe();
        reject(new Error("Auth state initialization timeout"));
      }, 5000);
    });
  }
  
  if (!user) {
    // User is not authenticated, clear session and redirect to signin
    sessionStorage.removeItem("smartFsUser");
    window.location.href = "/signin";
    throw new Error("User is not authenticated");
  }

  try {
    // getIdToken() automatically refreshes expired tokens
    // Pass false to use cached token if still valid, true to force refresh
    // Firebase handles token refresh automatically when expired
    const token = await user.getIdToken(false);
    
    // Always update sessionStorage with fresh token and current user data
    // This ensures the token is always up-to-date and user data is current
    const sessionData = sessionStorage.getItem("smartFsUser");
    let userData: any = {};
    
    // Try to preserve existing user data if available
    if (sessionData) {
      try {
        userData = JSON.parse(sessionData);
      } catch (e) {
        console.error("Error parsing existing sessionStorage:", e);
        // If parsing fails, start fresh
        userData = {};
      }
    }
    
    // Update with fresh token and current Firebase user data
    // This ensures all fields are current, especially the token
    userData.token = token;
    userData.id = user.uid;
    userData.email = user.email || userData.email;
    userData.username = user.displayName || userData.username;
    userData.photo = user.photoURL || userData.photo;
    
    // Save updated data to sessionStorage
    try {
      sessionStorage.setItem("smartFsUser", JSON.stringify(userData));
      // Token successfully updated in sessionStorage
    } catch (e) {
      console.error("Error updating sessionStorage:", e);
      // Continue even if sessionStorage update fails, but log the error
    }
    
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    // If token fetch fails, clear session and redirect
    sessionStorage.removeItem("smartFsUser");
    window.location.href = "/signin";
    throw error;
  }
}

/**
 * Gets user data from sessionStorage
 * @returns User data object or null if not found
 */
export function getUserData(): { id: string; token: string; email?: string; username?: string; photo?: string } | null {
  const sessionData = sessionStorage.getItem("smartFsUser");
  if (!sessionData) {
    return null;
  }
  
  try {
    return JSON.parse(sessionData);
  } catch (e) {
    console.error("Error parsing user data:", e);
    return null;
  }
}
