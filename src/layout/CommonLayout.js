import React from 'react';
import Navigation from './Navigation';
import Sidebar from './LeftSidebar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

function CommonLayout({ children }) {
	const location = useLocation();

	const notR = location.pathname === '/';

	return (
		<>
			{!notR ? (
				<div>
					<Navigation />
					<div className="container d-flex">
						<Sidebar />
						<main className="flex-grow-1">{children}</main>
					</div>
					<Footer />
				</div>
			) : (
				<>{children}</>
			)}
		</>
	);
}

export default CommonLayout;
