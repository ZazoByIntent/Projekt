import { useState } from 'react';
import cx from "classnames";
import styles from "../styles/Signin.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Link from "next/link";

function Register() {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [email, setEmail] = useState([]);
    const [error, setError] = useState([]);

    async function Register(e){
        e.preventDefault();
        const res = await fetch("http://localhost:3001/user", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            window.location.href="/login";
        }
        else{
            setUsername("");
            setPassword("");
            setEmail("");
            setError("Registration failed");
        }
    }

    return(
        <div className="mt-5 mx-auto pt-5 bg-light" style={{width: "500px"}}>
            <Form onSubmit={Register}>
                <h1>Registracija</h1>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email"
                                  value={email} onChange={(e)=>(setEmail(e.target.value))}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username"
                                  value={username} onChange={(e)=>(setUsername(e.target.value))}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password"
                                  value={password} onChange={(e)=>(setPassword(e.target.value))}/>
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" type="submit">
                        REGISTER
                    </Button>
                    <p>Ste že naš uporabnik?&nbsp;&nbsp;&nbsp;
                    <Link href="/login">PRIJAVA</Link>
                    </p>
                </Form.Group>
            </Form>
            <label>{error}</label>
        </div>
    );
}

export default Register;