import { useContext } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';


function Header(props) {   

    const userContext = useContext(UserContext); 


    function Filter() {
        console.log("filter");
        userContext.setFilter(true);
    }
    
    function Remove() {
        console.log("remove");
        userContext.setFilter(false);
    }

    return (
        <header>
            <Navbar bg="dark" expand="lg" variant="dark">
                <Container>
                    <Navbar.Brand href='/'>Home</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            <UserContext.Consumer>
                                {context => (
                                    context.user ?
                                        <>
                                            <Nav.Link href="/logout">Logout</Nav.Link>
                                            <Nav.Link onClick={() => Filter()}>Filter my data</Nav.Link>
                                            <Nav.Link onClick={() => Remove()}>Remove filter</Nav.Link>
                                        </>
                                    :
                                        <>
                                            <Nav.Link href="/login">Login</Nav.Link>
                                            <Nav.Link href="/register">Register</Nav.Link>
                                        </>
                                )}
                            </UserContext.Consumer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header >
    );
}

export default Header;