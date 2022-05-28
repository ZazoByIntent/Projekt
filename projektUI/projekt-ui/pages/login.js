import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import cx from 'classnames';
import styles from '../styles/Signin.module.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

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
        <div className="mx-auto bg-light" style={{width: "500px"}}>
        <Form onSubmit={Login}>
            <h1>Prijava</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter email"
                      value={username} onChange={(e)=>(setUsername(e.target.value))}/>
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password"
                 value={password} onChange={(e)=>(setPassword(e.target.value))}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
         </Form.Group>
        </Form>
        </div>
    );
}

export default Login;