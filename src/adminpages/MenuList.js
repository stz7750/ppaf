/**
 *packageName    : stz-
 * fileName       : MenuList
 * author         : stz
 * date           : 7/21/24
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 7/21/24        stz       최초 생성
 */
import React from 'react';

const MenuList = ({ menus, onSelectMenu, onDeleteMenu }) => {
	return (
		<div>
			<h2>Menu List</h2>
			<ul>
				{menus.map(menu => (
					<li key={menu.menuId}>
						{menu.menuName}
						<button onClick={() => onSelectMenu(menu)}>Edit</button>
						<button onClick={() => onDeleteMenu(menu.menuId)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default MenuList;
