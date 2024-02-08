import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import trans from '../commons/trans';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const navigateToJoin = () => {
    navigate('/join');
  }

    const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                // trans.post를 사용하여 로그인 API 호출
                const response = await trans.post('/api/login', { id, password });
                if (response.data) {
                  localStorage.setItem('authToken', response.data.token);
                  console.log('로그인 성공:', response.data.message);
                } else {
                  console.error('로그인 실패: 서버 응답이 없음');
                }
            } catch (error) {
                console.error("로그인 실패:", error.response.data);
            alert('Username:', id, 'Password:', password);
        };
    }
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>아이디</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Login
            </Button>
            <Button variant='primary' onClick={navigateToJoin}>Join</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}


export default Login;
