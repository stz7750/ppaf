import React, { useState, useEffect } from 'react';
import {
	AppBar,
	Toolbar,
	IconButton,
	Menu,
	MenuItem,
	Typography,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Button,
	Breadcrumbs,
	Link,
	Badge,
	Popover,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EventIcon from '@mui/icons-material/Event';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { Container } from 'react-bootstrap';

function Navigation({ menu, children, isSidebarOpen }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const login = useSelector(state => state.user);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const [badgeAnchorEl, setBadgeAnchorEl] = useState(null);

	useEffect(() => {
		if (menu) {
			const currentMenu = menu.find(item => location.pathname.includes(item.menuPath));
			if (currentMenu) {
				document.title = currentMenu.menuName;
			} else {
				document.title = 'stz';
			}
		}
	}, [menu, location.pathname]);

	const handleMenuOpen = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleDrawerToggle = () => {
		setDrawerOpen(!drawerOpen);
	};

	const handleLogout = () => {
		dispatch(logout());
		navigate('/login');
	};

	const menuItems = [
		{ text: '캘린더', icon: <CalendarTodayIcon />, path: '/Calendar' },
		{ text: '알림', icon: <NotificationsIcon />, path: '/Toast' },
		...(login?.id
			? [
					{ text: '메인', icon: <HomeIcon />, path: '/main' },
					{ text: '로그아웃', icon: <HomeIcon />, action: handleLogout },
				]
			: [{ text: '로그인', icon: <HomeIcon />, path: '/' }]),
		...(login?.id === 'admin'
			? [
					{ text: '관리자페이지', icon: <AdminPanelSettingsIcon />, path: '/admin/main' },
					{ text: '이벤트', icon: <EventIcon />, path: '/admin/Event' },
				]
			: []),
	];

	const createBreadcrumbItems = () => {
		const paths = location.pathname.split('/').filter(x => x);
		let accumulatedPath = '';
		const breadcrumbItems = paths.map((path, index) => {
			accumulatedPath += `${index > 0 ? '/' : ''}${path}`;
			const matchedMenu = menu?.find(item => item.menuPath === accumulatedPath);
			const pathLabel = matchedMenu ? matchedMenu.menuName : decodeURIComponent(path);

			return (
				<Link key={accumulatedPath} color="inherit" onClick={() => navigate(accumulatedPath)} style={{ cursor: 'pointer' }}>
					{pathLabel}
				</Link>
			);
		});
		return [
			<Link key="home" color="inherit" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
				홈
			</Link>,
			...breadcrumbItems,
		];
	};

	function notificationsLabel(count) {
		if (count === 0) {
			return 'no notifications';
		}
		if (count > 99) {
			return 'more than 99 notifications';
		}
		return `${count} notifications`;
	}

	const handleBadgeClick = event => {
		setBadgeAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setBadgeAnchorEl(null);
	};

	return (
		<>
			<AppBar
				position="static"
				sx={{ zIndex: 10, marginLeft: isSidebarOpen ? '200px' : '0', width: isSidebarOpen ? 'calc(100% - 200px)' : '100%', transition: 'margin 0.3s, width 0.3s' }}
			>
				<Toolbar style={{ zIndex: 10 }}>
					<List sx={{ display: 'flex', flexGrow: 1 }}>
						{menuItems.map((item, index) => (
							<ListItem
								button
								key={index}
								onClick={() => {
									handleMenuClose();
									if (item.path) navigate(item.path);
									if (item.action) item.action();
								}}
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: '2px', // 간격을 줄이기 위해 2px로 설정
									padding: '2px 4px', // 패딩도 줄여서 전체 크기를 줄임
									minWidth: 'auto',
								}}
							>
								<ListItemIcon sx={{ minWidth: '10px' }}>{item.icon}</ListItemIcon> {/* 아이콘의 너비 조정 */}
								<ListItemText primary={item.text} sx={{ margin: 0 }} />
							</ListItem>
						))}
					</List>
					<Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						안녕하세요 {login.id}님!
						<IconButton aria-label={notificationsLabel(100)} onClick={handleBadgeClick}>
							<Badge badgeContent={101} color="primary">
								<NotificationsIcon />
							</Badge>
						</IconButton>
					</Typography>
					<div>
						<IconButton color="inherit" onClick={handleMenuOpen}>
							<MenuIcon />
						</IconButton>
						<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
							{menuItems.map((item, index) => (
								<MenuItem
									key={index}
									onClick={() => {
										handleMenuClose();
										if (item.path) navigate(item.path);
										if (item.action) item.action();
									}}
								>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.text} />
								</MenuItem>
							))}
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
			<Popover
				open={Boolean(badgeAnchorEl)}
				anchorEl={badgeAnchorEl}
				onClose={handlePopoverClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<Typography sx={{ p: 2 }}>알림 내용이 표시됩니다.</Typography>
			</Popover>
			<Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
				<List>
					{menuItems.map((item, index) => (
						<ListItem
							button
							key={index}
							onClick={() => {
								setDrawerOpen(false);
								if (item.path) navigate(item.path);
								if (item.action) item.action();
							}}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItem>
					))}
				</List>
			</Drawer>
			<Breadcrumbs separator="›" aria-label="breadcrumb" style={{ margin: '20px', marginLeft: isSidebarOpen ? '220px' : '20px', transition: 'margin-left 0.3s' }}>
				{createBreadcrumbItems()}
			</Breadcrumbs>
			<Container>{children}</Container>
			<Footer />
		</>
	);
}

export default Navigation;
