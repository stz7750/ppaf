import React from 'react';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';


function Admins(props) {
    return (
        <div>
            <Container fluid>
      <Row>
        <Col>
          <h1>사용자 관리</h1>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>번호</th>
                <th>이름</th>
                <th>사번</th>
                <th>권한그룹</th>
                {/* 추가적인 테이블 헤더 */}
              </tr>
            </thead>
            <tbody>
              {/* 사용자 데이터를 여기에 반복적으로 표시 */}
              <tr>
                <td>1</td>
                <td>홍길동</td>
                <td>admin</td>
                <td>시스템 관리자</td>
                {/* 추가적인 데이터 셀 */}
              </tr>
              {/* 더 많은 행이 추가될 수 있습니다. */}
            </tbody>
          </Table>
        </Col>
        <Col md={4}>
          <Form>
            {/* 폼 필드들 */}
            <Form.Group controlId="formUserName">
              <Form.Label>이름</Form.Label>
              <Form.Control type="text" placeholder="이름을 입력하세요." />
            </Form.Group>
            <Form.Group controlId="formUserId">
              <Form.Label>사번</Form.Label>
              <Form.Control type="text" placeholder="사번을 입력하세요." />
            </Form.Group>
            {/* 추가적인 폼 필드들 */}
            <Button variant="primary" type="submit">
              저장
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
        </div>
    );
}

export default Admins;