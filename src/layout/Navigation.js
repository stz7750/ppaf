import React, { useEffect } from 'react';
import { Container, Navbar, Nav, Breadcrumb } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import userSlice, { logout } from '../redux/userSlice';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

function Navigation({ menu, children }) {
	const naviStyle = {
		zIndex: 10,
	};
	const login = useSelector(state => state.user);
	const dispatch = useDispatch();
	const location = useLocation();
	/* userId: userInfo.userId, accessToken: JSON.parse(localStorage.getItem('accessToken')).value  */

	useEffect(() => {
		if (menu) {
			// 현재 경로와 일치하는 메뉴 항목을 찾습니다.
			const currentMenu = menu.find(item => location.pathname.includes(item.menuPath));
			if (currentMenu) {
				document.title = currentMenu.menuName; // 페이지 타이틀 설정
			} else {
				document.title = 'stz'; // 기본 타이틀
			}
		}
	}, [menu, location.pathname]);
	const logoutMemer = () => {
		dispatch(logout());
	};
	const createBreadcrumbItems = () => {
		const paths = location.pathname.split('/').filter(x => x);
		const breadcrumbItems = paths.map((path, index) => {
			const href = '/' + paths.slice(0, index + 1).join('/');
			const matchedMenu = menu?.find(item => item.menuPath === href);
			const pathLabel = matchedMenu ? matchedMenu.menuName : decodeURIComponent(path);
			const isActive = index === paths.length - 1;

			return (
				<Breadcrumb.Item key={href} href={href} active={isActive}>
					{pathLabel}
					{index < paths.length - 1}
				</Breadcrumb.Item>
			);
		});
		return [
			<Breadcrumb.Item key="home" href="/">
				홈
			</Breadcrumb.Item>,
			...breadcrumbItems,
		];
	};

	return (
		<>
			<Navbar bg="light" expand="lg" style={naviStyle}>
				<Navbar.Brand href="/main">안녕하세요 {login.id}님!</Navbar.Brand>
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
								<Nav.Link href="/">로그인</Nav.Link>
							</>
						)}
						{login?.id === 'admin' ? (
							<>
								<Nav.Link href="/admin/main">관리자페이지</Nav.Link>
								<Nav.Link href="/admin/Event">이벤트</Nav.Link>
							</>
						) : (
							<></>
						)}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
			<Breadcrumb className="d-flex justify-content-end" style={{ backgroundColor: '#EBEBEB', marginBottom: '20px' }}>
				{createBreadcrumbItems()}
			</Breadcrumb>
			<Container>{children}</Container>
			<Footer />
		</>
	);
}

export default Navigation;
