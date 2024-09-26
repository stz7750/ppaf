import React from 'react';
import Navigation from './Navigation';
import Sidebar from './LeftSidebar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import stz from '../commons/stzUtil';
function CommonLayout({ children }) {
	const location = useLocation();

	const notR = location.pathname === '/login';
	const gisPage = location.pathname.includes('Map');

	return (
		<>
			{!notR ? (
				<div>
					<Navigation />
					{!gisPage && <Sidebar />}
					<main className="flex-grow-1" style={{ overflowY: 'auto', height: '100vh' }}>
						{children}
					</main>
					{!gisPage && <Footer />}
				</div>
			) : (
				<>{children}</>
			)}
		</>
	);
}

export default CommonLayout;
