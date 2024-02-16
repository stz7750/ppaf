import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import userSlice, { logout } from '../redux/userSlice';

function Navigation(props) {
    const login = useSelector(state => state.userSlice);
    const dispatch = useDispatch();
    /* userId: userInfo.userId, accessToken: JSON.parse(localStorage.getItem('accessToken')).value  */
    console.log(login);
    const logoutMemer = () => {
        dispatch(logout())
    }
    return (
        <>
         <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">stz7750 || 안녕하세요!</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="/Calendar">캘린더</Nav.Link>
                <Nav.Link href="/Toast">알림</Nav.Link>
                {  login?.id ?
                    <>
                    <Nav.Link href="/login" onClick={logoutMemer}>로그아웃</Nav.Link>
                    </>
                    :
                    <>
                    <Nav.Link href="/login">로그인</Nav.Link>
                    </>
                }
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