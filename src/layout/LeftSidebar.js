import React, { useState } from 'react';
import { Button, Nav } from 'react-bootstrap';

function LeftSidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
        <Nav defaultActiveKey="/home" className="flex-column" style={{marginTop : "100px"}}>
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/features">Features</Nav.Link>
          <Nav.Link href="/pricing">Pricing</Nav.Link>
          {/* 추가 메뉴 항목들 */}
        </Nav>
      </div>
      {/* 사이드바의 상태에 따라 조정되는 본문 컨텐츠 영역 */}
      <div style={contentStyle}>
       
      </div>
    </>
  );
}

export default LeftSidebar;
