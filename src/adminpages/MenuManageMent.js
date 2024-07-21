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
import MenuTable from './MenuTable';
import MenuForm from './MenuForm';
import { Treebeard } from 'react-treebeard';
import trans from '../commons/trans';
import { log, stzUtil } from '../commons/stzUtil';

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const treeStyles = {
    tree: {
      base: {
        listStyle: 'none',
        backgroundColor: 'white',
        margin: 0,
        padding: 0,
        color: '#000',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
      },
      node: {
        base: {
          position: 'relative',
        },
        link: {
          cursor: 'pointer',
          position: 'relative',
          padding: '0px 5px',
          display: 'block',
        },
        activeLink: {
          background: '#ddd',
        },
        toggle: {
          base: {
            position: 'relative',
            display: 'inline-block',
            verticalAlign: 'middle',
            marginLeft: '-5px',
            height: '24px',
            width: '24px',
          },
          wrapper: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            margin: '-7px 0 0 -7px',
            height: '14px',
          },
          height: 14,
          width: 14,
          arrow: {
            fill: '#9DA5AB',
            strokeWidth: 0,
          },
        },
        header: {
          base: {
            display: 'inline-block',
            verticalAlign: 'middle',
            color: '#000',
          },
          connector: {
            width: '2px',
            height: '12px',
            borderLeft: 'solid 2px black',
            borderBottom: 'solid 2px black',
            position: 'absolute',
            top: '0px',
            left: '-21px',
          },
          title: {
            lineHeight: '24px',
            verticalAlign: 'middle',
          },
        },
        subtree: {
          listStyle: 'none',
          paddingLeft: '19px',
        },
        loading: {
          color: '#E2C089',
        },
      },
    },
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    const response = await trans.get('/admin/api/getAllMenus');
    const menuTree = stzUtil.buildTree(response.data, 'menuId', 'parentMenuId');
    setMenus(menuTree);
    log(menuTree);
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

  const handleSelectMenu = (menu) => {
    setSelectedMenu(menu);
  };

  const handleFormSubmit = async (menu) => {
    if (menu.menuId) {
      await axios.put(`/admin/api/${menu.menuId}`, menu);
    } else {
      await axios.post('/admin/api', menu);
    }
    fetchMenus();
    setSelectedMenu(null);
  };

  return (
    <div>
      <h1>메뉴관리</h1>
      <Treebeard data={menus} onToggle={handleToggle} style={treeStyles} />
      <MenuForm menu={selectedMenu} onSubmit={handleFormSubmit} menus={menus} />
    </div>
  );
};

export default MenuManagement;
