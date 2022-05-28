import { useState } from 'react';
import cx from "classnames";
import styles from "../styles/Signin.module.css";

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
        <div className="aligment">
            <form onSubmit={Register} id="login-form" className="login-form" autoComplete="off" role="main">
                <h1 textalign="center">Registracija</h1>
                <div>
                    <label className="label-email">
                        <input type="email" className="text" name="email" placeholder="Email" tabIndex="1"
                               value={email} onChange={(e)=>(setEmail(e.target.value))}required/>
                        <span className="required">Email</span>
                    </label>
                </div>
                <div>
                    <label className="label-email">
                        <input type="text" className="text" name="email" placeholder="Username" tabIndex="1"
                               value={username} onChange={(e)=>(setUsername(e.target.value))}required/>
                        <span className="required">Username</span>
                    </label>
                </div>
                <input type="checkbox" name="show-password" className="show-password a11y-hidden" id="show-password"
                       tabIndex="3" />
                <label className="label-show-password" htmlFor="show-password">
                    <span>Show Password</span>
                </label>
                <div>
                    <label className="label-password">
                        <input type="text" className="text" name="password" placeholder="Password" tabIndex="2"
                               value={password} onChange={(e)=>(setPassword(e.target.value))}required/>
                        <span className="required">Password</span>
                    </label>
                </div>
                <input type="submit" value="Register"/>
                <div className="email">
                   <p> Ste že registrirani? <a href="/login">Prijava</a> </p>
                </div>
                <figure aria-hidden="true">
                    <div className="person-body"></div>
                    <div className="neck skin"></div>
                    <div className="head skin">
                        <div className="eyes"></div>
                        <div className="mouth"></div>
                    </div>
                    <div className="hair"></div>
                    <div className="ears"></div>
                    <div className="shirt-1"></div>
                    <div className="shirt-2"></div>
                </figure>
            </form>
            <label>{error}</label>
        </div>
    );
}

export default Register;