import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";

import { FileCacheProvider } from '../Context/FileCacheContext.tsx';
import { AuthProvider } from '../Context/AuthContext.tsx';

import WebPage from '../Components/Website/WebPage.tsx';
import SignUpPage from '../Components/Website/SignUpPage.tsx';
import LogInPage from "../Components/Website/LoginPage.tsx";
import Homepage from '../Components/WebApp/Homepage.tsx';

const AppRouter = () => {
  return (
    <AuthProvider>
      <FileCacheProvider>
        <BrowserRouter>
          <Routes>
              <Route path='/' Component={WebPage}/>
              <Route path='/signin' Component={LogInPage}/>
              <Route path='/signup' Component={SignUpPage}/>
              <Route path='/home' Component={Homepage}/>
          </Routes>
        </BrowserRouter>
      </FileCacheProvider>
    </AuthProvider>
  )
}

export default AppRouter;
