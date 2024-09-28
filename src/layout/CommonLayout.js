import React, { useEffect } from 'react';
import Navigation from './Navigation';
import Sidebar from './LeftSidebar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import stz from '../commons/stzUtil';
import { useGetDataQuery } from '../commons/RtkqGetApi';
function CommonLayout({ children }) {
	const location = useLocation();

	const notR = location.pathname === '/login';
	const gisPage = location.pathname.includes('Map');

	const { data: menu, isLoading } = useGetDataQuery({ url: 'admin/api/getAllMenus', params: { useYn: 'Y' } });

	if (isLoading) return null;
	return (
		<>
			{!notR ? (
				<div>
					<Navigation menu={menu} />
					<div className=" d-flex">
						{!gisPage && <Sidebar data={menu} />}
						<main className="flex-grow-1" style={{ overflowY: 'auto', height: '400vh' }}>
							{children}
						</main>
					</div>
					{!gisPage && <Footer />}
				</div>
			) : (
				<>{children}</>
			)}
		</>
	);
}

export default CommonLayout;
