import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import cx from 'classnames';
import styles from '../styles/Signin.module.css'


function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext);

    async function Login(e){
        e.preventDefault();
        const res = await fetch("http://localhost:3001/user/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        console.log("data",data);
        if(data._id !== undefined){
            userContext.setUserContext(data);
            console.log("User Context1",userContext);
            console.log("data2",data);
            window.location.href="/map";
        } else {
            console.log("napaka");
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
        }
        console.log("User Context2",userContext);
    }

    return (
        <div className="aligment">
        <form onSubmit={Login} id="login-form" className="login-form" autoComplete="off" role="main">
            <h1 textalign="center">Prijava</h1>
            <div>
                <label className="label-email">
                    <input type="text" className="text" name="email" placeholder="Username" tabIndex="1"
                           value={username} onChange={(e)=>(setUsername(e.target.value))}required/>
                    <span className="required">Username</span>
                </label>
            </div>
            <input type="checkbox" name="show-password" className="show-password a11y-hidden" id="show-password"
                   tabIndex="3"/>
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
            <input type="submit" value="Log In"/>
            <div className="email">
                <p> Še niste registrirani? <a href="/register">Registracija</a> </p>
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

export default Login;