import Link from 'next/link'
import { useState } from "react";
import styles from "../styles/Layout.module.css";
import styles2 from '../styles/Home.module.css'
import Head from "next/head";
import Navbar from 'react-bootstrap/Navbar'
export default function Navigation(){

    return <>
        <div className="pos-f-t">
            <div className="collapse" id="navbarToggleExternalContent">
                <div className="bg-dark p-4">
                    <h4 className="text-white">Collapsed content</h4>
                    <span className="text-muted">Toggleable via the navbar brand.</span>
                </div>
            </div>
            <nav className="navbar navbar-dark bg-dark">
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </nav>
        </div>
    </>
}