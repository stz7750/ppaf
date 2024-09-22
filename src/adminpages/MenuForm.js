/**
 *packageName    : stz-
 * fileName       : MenuForm
 * author         : stz
 * date           : 7/21/24
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 7/21/24        stz       최초 생성
 */
import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

const MenuForm = ({ menu, onSubmit, menus }) => {
	const [formData, setFormData] = useState({
		menuId: '',
		menuName: '',
		parentMenuId: '',
		menuSeq: '',
		menuPath: '',
		pathName: '',
	});

	useEffect(() => {
		if (menu) {
			setFormData(menu);
		} else {
			setFormData({
				menuId: '',
				menuName: '',
				parentMenuId: '',
				menuSeq: '',
				menuPath: '',
				pathName: '',
			});
		}
	}, [menu]);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = e => {
		e.preventDefault();
		onSubmit(formData);
	};

	const renderMenuOptions = (menus, depth = 0) => {
		return menus.map(menu => (
			<MenuItem key={menu.menuId} value={menu.menuId}>
				{'--'.repeat(depth) + menu.menuName}
			</MenuItem>
		));
	};

	return (
		<Box sx={{ p: 3 }}>
			<h2>{menu ? 'Edit Menu' : 'Add Menu'}</h2>
			<form onSubmit={handleSubmit}>
				<FormControl fullWidth margin="normal">
					<TextField label="Menu Name" variant="outlined" name="menuName" value={formData.menuName} onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth margin="normal">
					<InputLabel id="parent-menu-label">Parent Menu</InputLabel>
					<Select labelId="parent-menu-label" name="parentMenuId" value={formData.parentMenuId} label="Parent Menu" onChange={handleChange}>
						<MenuItem value="">No Parent</MenuItem>
						{renderMenuOptions(menus)}
					</Select>
				</FormControl>
				<FormControl fullWidth margin="normal">
					<TextField label="Menu Sequence" variant="outlined" name="menuSeq" value={formData.menuSeq} onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth margin="normal">
					<TextField label="Menu Path" variant="outlined" name="menuPath" value={formData.menuPath} onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth margin="normal">
					<TextField label="Path Name" variant="outlined" name="pathName" value={formData.pathName} onChange={handleChange} />
				</FormControl>
				<Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
					{menu ? 'Update Menu' : 'Add Menu'}
				</Button>
			</form>
		</Box>
	);
};

export default MenuForm;
