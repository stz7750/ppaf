import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import Sidebar from './LeftSidebar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { stz } from '../commons/stzUtil';
import { stzUtil } from '../commons/stzUtil';
import { useGetDataQuery } from '../commons/RtkqGetApi';
import { Box } from '@mui/material';
import { isEqual } from 'lodash';

function CommonLayout({ children }) {
	const location = useLocation();

	const notR = location.pathname === '/login';
	const gisPage = location.pathname.includes('Map');
	const [isSidebarOpen, setSidebarOpen] = useState(true);

	const { data: menu, isLoading } = useGetDataQuery({ url: 'admin/api/getAllMenus', params: { useYn: 'Y' } });

	useEffect(() => {
		window.stzUtil = stzUtil;
		window.stz = stz;
	}, []);

	if (isLoading) return null;
	return (
		<>
			{!notR ? (
				<div>
					<Navigation menu={menu} isSidebarOpen={isSidebarOpen} />
					<div className=" d-flex">
						{!gisPage && <Sidebar data={menu} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />}
						<main className="flex-grow-1" style={{ overflowY: 'auto', height: '400vh' }}>
							<Box padding={3}>{children}</Box>
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

export default React.memo(CommonLayout, (prevProps, nextProps) => {
	return isEqual(prevProps, nextProps);
});
