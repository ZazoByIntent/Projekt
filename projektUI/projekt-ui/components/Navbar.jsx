import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

export default function Navigation(){
    return <>

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
}

  /*
  https://react-bootstrap.github.io/components/navs/
  <NavDropdown title="Products">
    <NavDropdown.Item href="index">Index</NavDropdown.Item>
</NavDropdown> */