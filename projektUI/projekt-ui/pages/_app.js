import '../styles/globals.css'
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "../components/Navbar";
import { BrowserRouter} from 'react-router-dom';
import { UserContext } from "../userContext";
import React from 'react'
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {


  return(
      <>

        <Navbar/>
        <Component {...pageProps} />

      </>
  )
}

export default MyApp
