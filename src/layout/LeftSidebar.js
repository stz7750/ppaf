import React, { useEffect, useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import trans from '../commons/trans';

function LeftSidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [menuData, setMenuData] = useState();
  useEffect(() => {
    (async () => {
      try {
            const response = await trans.get("admin/api/getMenu");
            const menuData = response.data;
            const menuTree = [];
            const menuItemsMap = {};

            // 메뉴 항목을 id를 키로 사용하는 맵으로 변환하여 접근성 향상
            menuData.forEach(menu => {
              menuItemsMap[menu.menu_id] = { ...menu, children: [] };
            });

            // 각 메뉴 항목에 대해 상위 메뉴가 있다면 그 메뉴의 자식으로, 없다면 최상위 메뉴로 처리
            menuData.forEach(menu => {
              if (menu.parent_menu_id) {
                menuItemsMap[menu.parent_menu_id].children.push(menuItemsMap[menu.menu_id]);
              } else {
                menuTree.push(menuItemsMap[menu.menu_id]);
              }
            console.table(menuTree);
            setMenuData(menuTree);
        })
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  // 인라인 스타일 정의
  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: isSidebarOpen ? 0 : '-200px', // 사이드바 열림/닫힘 상태에 따른 좌표
    bottom: 0,
    width: '200px',
    backgroundColor: '#f8f9fa',
    overflowY: 'auto',
    transition: 'left 0.3s',
  };

  const toggleButtonStyle = {
    position: 'fixed',
    top: '50%',
    left: isSidebarOpen ? '200px' : '0px', // 버튼 위치 조정
    transform: 'translateY(-50%)',
    zIndex: 1500, // 사이드바보다 높게 설정하여 버튼이 항상 보이도록
    cursor: 'pointer',
  };

  const contentStyle = {
    transition: 'margin 0.3s',
    marginLeft: isSidebarOpen ? '200px' : '0', // 사이드바 상태에 따라 본문 위치 조정
    padding: '20px',
  };
  return (
    <>
      <Button style={toggleButtonStyle} onClick={() => setSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? '<' : '>'}
      </Button>
      <div style={sidebarStyle}>
        <Nav defaultActiveKey="/home" className="flex-column" style={{marginTop: "100px"}}>
          {menuData?.map((item) => (
            <div key={item.menu_id}>
              <Nav.Link href={`/${item.menu_path}`}>
                {item.menu_name}
              </Nav.Link>
              {item.children.length > 0 && (
                <div style={{ marginLeft: 20 }}>
                  {item.children.map((child) => (
                    <Nav.Link key={child.menu_id} href={`/${child.menu_path}`}>
                      {child.menu_name}
                    </Nav.Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Nav>
      </div>
      {/* 사이드바의 상태에 따라 조정되는 본문 컨텐츠 영역, contentStyle 적용 */}
      <div style={contentStyle}>
        {/* 실제 컨텐츠 영역 */}
      </div>
    </>
  );
}

export default LeftSidebar;
