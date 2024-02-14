import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';

function Navigation(props) {

    /* userId: userInfo.userId, accessToken: JSON.parse(localStorage.getItem('accessToken')).value  */

    return (
        <>
         <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">stz7750</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="/Calendar">캘린더</Nav.Link>
                <Nav.Link href="/Toast">알림</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Navbar>
        <Container>
            {props.children}
        </Container>
        </>
    );
}

export default Navigation;