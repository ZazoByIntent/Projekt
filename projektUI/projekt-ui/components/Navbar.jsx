import Link from 'next/link'
import { useState } from "react";
import styles from "../styles/Layout.module.css";
import styles2 from '../styles/Home.module.css'
import Head from "next/head";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
export default function Navigation(){

    return <>
    <div>
    <Navbar fixed="top" bg="dark" variant="dark">
            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/map">Mapa</Nav.Link>
                <Nav.Link href="/login">Prijava</Nav.Link>
                <Nav.Link href="/register">Registracija</Nav.Link>
            </Nav>
    </Navbar>
    </div>
    </>
}