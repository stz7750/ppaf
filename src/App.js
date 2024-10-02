import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Join from './pages/Join';
import Toast from './pages/Toast';
import Calendar from './pages/Calendar';
import BigCalendar from './pages/BigCalendar';
import Main from './pages/Main';
import Admin from './adminpages/Admin';
import Admins from './adminpages/Admins';
import RegEvent from './adminpages/RegEvent';
import Footer from './layout/Footer';
import Navigation from './layout/Navigation';
import { useSelector } from 'react-redux';
import AdminNavigation from './layout/AdminNavigation';
import Spinner from './commons/Spinner';
import CommonLayout from './layout/CommonLayout';
import MenuManagement from './adminpages/MenuManageMent';
import ExampleComponents from './pages/ExampleComponents';
import OlMap from './adminpages/openLayers/OlMap';
import './Assets/custom.css';
import './commons/stzUtil';

function usePageLoading() {
	const [isLoading, setIsLoading] = useState(false);
	const location = useLocation();

	useEffect(() => {
		setIsLoading(true);
		// 경로가 변경될 때마다 로딩 상태를 true로 설정하고 3초 후에 false로 설정
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, [location]); // location을 의존성 배열에 추가하여 경로 변경 시마다 효과를 다시 실행

	return isLoading;
}

function AppWithRouter() {
	const isLoading = usePageLoading();

	return (
		<>
			<CommonLayout>
				{isLoading && <Spinner />}
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/join" element={<Join />} />
					<Route path="/Toast" element={<Toast></Toast>} />
					<Route path="/Calendar" element={<Calendar></Calendar>} />
					<Route path="admin/BigCalendar" element={<BigCalendar />} />
					<Route path="/main" element={<Main />} />
					<Route path="/admin" element={<Admin />} />
					<Route path="/admin/main2" element={<Admins />} />
					<Route path="/admin/Event" element={<RegEvent />} />
					<Route path="/admin/MenuManageMent" element={<MenuManagement />} />
					<Route path={'/admin/olMap'} element={<OlMap />} />
					{/* 공통 컴포넌트들을 사용할 페이지*/}
					<Route path={'/admin/ExampleComponentes'} element={<ExampleComponents />} />
				</Routes>
			</CommonLayout>
		</>
	);
}

function App() {
	return (
		<Router>
			<AppWithRouter />
		</Router>
	);
}

export default App;
