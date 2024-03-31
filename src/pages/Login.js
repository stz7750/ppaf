import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import trans from '../commons/trans';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import { login } from '../redux/userSlice';
import Navigation from '../layout/Navigation';

function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [btnDis, setBtnDis] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateToJoin = () => {
    navigate('/join');
  }
  const login2 = useSelector(state => state.userSlice);
  useEffect(() => {
    if(id === '' || password === '') {
      setBtnDis(true);
    }else{
      setBtnDis(false);
    }
  })
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append("username", id);
    form.append("password", password);
      try {
        const response = await trans.post('/api/login', form); // 서버로 POST 요청을 보냅니다.
        // 로그인 성공 처리...
        if (response.data) {
          console.log(response.data,"지금부터 여기 이용");
          localStorage.setItem('authToken', response.data.accessToken);
          dispatch(login({
            id
            ,pw: password
            ,role : response.data.role
          }));
          navigate("/main")
        } else {
          toast.error('로그인 실패: 서버 응답이 없음');
        }
      } catch (error) {
          toast.error(error);
      }
  };
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
      name="username"
      onChange={(e) => setId(e.target.value)}
    />
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label>비밀번호</Form.Label>
    <Form.Control
      type="password"
      placeholder="Password"
      value={password}
      name="password"
      onChange={(e) => setPassword(e.target.value)}
    />
  </Form.Group>

  <Button variant="primary" type="submit" disabled={btnDis}>
    Login
  </Button>
</Form>

        </Col>
      </Row>
      <ToastContainer position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"/>
    </Container>
  );
}

export default Login;
