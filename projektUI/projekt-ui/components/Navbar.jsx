import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { UserContext } from '../userContext';
export default function Navigation(){
    return (
        <UserContext.Consumer>
            {context => (
                context.user ?
                    <>
                        <Navbar className="justify-content-center"fixed="top" bg="dark" variant="dark" expand="lg">
                                <Navbar.Brand href="#home">PROJEKT</Navbar.Brand>
                                <Navbar.Toggle/>
                                <Navbar.Collapse>
                                <Nav className="justify-content-center" >

                                    <Nav.Link href="/map">Mapa</Nav.Link>
                                    <Nav.Link href="/logout">Odjava</Nav.Link>
                                </Nav>
                                </Navbar.Collapse>
                        </Navbar>
                </>
                    :
                <>
                    <Navbar className="justify-content-center"fixed="top" bg="dark" variant="dark" expand="lg">
                        <Navbar.Brand href="#home">PROJEKT</Navbar.Brand>
                        <Navbar.Toggle/>
                        <Navbar.Collapse>
                            <Nav className="justify-content-center" >

                                <Nav.Link href="/map">Mapa</Nav.Link>
                                <Nav.Link href="/login">Prijava</Nav.Link>
                                <Nav.Link href="/register">Registracija</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </>
            )}
        </UserContext.Consumer>
    );

}

