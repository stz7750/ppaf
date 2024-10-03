/**
 *packageName    : stz-
 * fileName       : MenuManageMent.js
 * author         : stz
 * date           : 7/21/24
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 7/21/24        stz       최초 생성
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuForm from './MenuForm';
import trans from '../commons/trans';
import { log, stzUtil } from '../commons/stzUtil';
import MaterialTable from 'material-table';
import { Switch, Grid, IconButton } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown, Delete, Search, Clear } from '@mui/icons-material';
import GlobalAlert from '../commons/GlobalAlert';

const MenuManagement = () => {
	const [menus, setMenus] = useState([]);
	const [selectedMenu, setSelectedMenu] = useState(null);

	useEffect(() => {
		fetchMenus();
	}, []);

	const fetchMenus = async () => {
		const response = await trans.get('/admin/api/getAllMenus');
		/*const menuTree = stzUtil.buildTree(response.data, 'menuId', 'parentMenuId');*/
		setMenus(response.data);
		log(response.data);
	};

	const handleToggle = (node, toggled) => {
		if (selectedMenu) {
			setSelectedMenu({
				...selectedMenu,
				active: false,
			});
		}
		node.active = true;
		if (node.children) {
			node.toggled = toggled;
		}
		setSelectedMenu(node);
	};

	const handleSelectMenu = menu => {
		setSelectedMenu(menu);
	};

	const handleFormSubmit = async menu => {
		if (menu.menuId) {
			await trans.post(`/admin/api/upsertMenuById`, menu);
		} else {
			await trans.post('/admin/api/upsertMenuById', menu);
		}
		fetchMenus();
		setSelectedMenu(null);
	};

	const handleDeleteMenu = async menuId => {
		await axios.delete(`/admin/api/${menuId}`);
		fetchMenus();
	};

	const handleToggleChange = async menu => {
		const updatedMenu = {
			menuId: menu.menuId,
			useYn: menu.useYn === 'Y' ? 'N' : 'Y',
		};

		try {
			await trans.post(`/admin/api/upsertMenuById`, updatedMenu);
			// 상태를 직접 업데이트하여 테이블을 다시 렌더링
			setMenus(prevMenus => prevMenus.map(m => (m.menuId === menu.menuId ? { ...m, useYn: updatedMenu.useYn } : m)));
		} catch (error) {
			console.error('Error updating menu:', error);
		}
	};

	const columns = [
		{
			title: '사용 여부',
			field: 'useYn',
			render: rowData => <Switch checked={rowData.useYn === 'Y'} onChange={() => handleToggleChange(rowData)} color="primary" />,
		},
		{ title: 'Menu Name', field: 'menuName' },
		{ title: 'Menu ID', field: 'menuId' },
		{ title: 'Menu Path', field: 'menuPath' },
	];

	return (
		<div style={{ padding: '20px' }}>
			<h1>메뉴관리</h1>
			<Grid container spacing={3}>
				<Grid item xs={8}>
					<MaterialTable
						title="페이지 메뉴"
						columns={columns}
						data={menus}
						parentChildData={(row, rows) => rows.find(a => a.menuId === row.parentMenuId)}
						options={{
							paging: true,
							pageSize: 10,
							pageSizeOptions: [10, 20, 50],
							sorting: true,
							maxBodyHeight: '60vh',
							minBodyHeight: '60vh',
						}}
						icons={{
							Search: () => <Search style={{ color: 'blue' }} />, // 검색 아이콘 변경
							ResetSearch: () => <Clear style={{ color: 'red' }} />, // 검색 초기화 아이콘 변경
							DetailPanel: ({ open }) => (open ? <KeyboardArrowDown /> : <KeyboardArrowRight />),
							Delete: () => <Delete style={{ color: 'red' }} />,
						}}
						editable={
							{
								/*onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  handleDeleteMenu(oldData.menuId);
                  resolve();
                }),*/
							}
						}
					/>
				</Grid>
				<Grid item xs={4}>
					<div>
						<MenuForm menu={selectedMenu} onSubmit={handleFormSubmit} menus={menus} />
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

export default MenuManagement;
