import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { logout } from '../redux/userSlice';
import { Breadcrumb, Container, Nav, Navbar } from 'react-bootstrap';
import Footer from './Footer';

function AdminNavigation(props) {
    const login = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const location = useLocation();
    /* userId: userInfo.userId, accessToken: JSON.parse(localStorage.getItem('accessToken')).value  */
    console.log(login);
    const logoutMemer = () => {
        dispatch(logout());
    };

    const createBreadcrumbItems = () => {
        const paths = location.pathname.split('/').filter((x) => x);
        const breadcrumbItems = paths.map((path, index) => {
            const href = '/' + paths.slice(0, index + 1).join('/');
            const pathFormatter = '';
            // eslint-disable-next-line default-case
            /*  switch(path){
                case 'main' :
                    return pathFormatter += "메인";
                    break;
                case 'admin' :
                    return pathFormatter += "관리";
                    break;
                case 'Event' :
                    return pathFormatter += "이벤트";
                    break;
                case 'main2' :
                    return pathFormatter += "사이트 관리";
                    break;
                case 'Calendar':
                    return pathFormatter += "스케줄";
                    break;
            } */
            const isActive = index === paths.length - 1;
            return (
                <Breadcrumb.Item key={href} href={href} active={isActive}>
                    {decodeURIComponent(path)}
                    {index < paths.length - 1 && ' < '} {/* 공백과 <를 추가 */}
                </Breadcrumb.Item>
            );
        });
        return [
            <Breadcrumb.Item key="home" href="/"></Breadcrumb.Item>,
            ...breadcrumbItems,
        ];
    };

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/main">
                    안녕하세요 {login.id}님!
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/Calendar">캘린더</Nav.Link>
                        <Nav.Link href="/Toast">알림</Nav.Link>
                        {login?.id ? (
                            <>
                                <Nav.Link href="/main">메인</Nav.Link>
                                <Nav.Link href="/login" onClick={logoutMemer}>
                                    로그아웃
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link href="/login">로그인</Nav.Link>
                            </>
                        )}
                        {login?.id === 'admin' ? (
                            <>
                                <Nav.Link href="/admin/main">
                                    관리자페이지
                                </Nav.Link>
                                <Nav.Link href="/admin/Event">이벤트</Nav.Link>
                            </>
                        ) : (
                            <></>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Breadcrumb
                className="d-flex justify-content-end"
                style={{ backgroundColor: '#EBEBEB', marginBottom: '20px' }}>
                {createBreadcrumbItems()}
            </Breadcrumb>
            <Container>{props.children}</Container>
            <Footer />
        </>
    );
}

export default AdminNavigation;
