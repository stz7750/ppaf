import React, { useState } from 'react';
import trans from '../commons/trans';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Navigation from '../layout/Navigation';

function Join(props) {
	const Navigate = useNavigate();
	const [user, setUser] = useState({
		id: '',
		email: '',
		password: '',
		name: '',
	});
	const handleChange = e => {
		const { name, value } = e.target;
		setUser(prevUser => ({
			...prevUser,
			[name]: value,
		}));
	};

	const handleSubmit = async e => {
		e.preventDefault();

		const emailRegex = /\S+@\S+\.\S+/;
		const reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

		// 필수 필드 검사
		if (!user.id || !user.email || !user.password || !user.name) {
			toast.error('모든 필드를 채워주세요.');
			return;
		}

		if (!emailRegex.test(user.email)) {
			toast.error('유효하지 않은 이메일 형식입니다.');
			return;
		}

		// 비밀번호 길이 검사
		if (!reg.test(user.password)) {
			toast.error('비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상 15자 이하로 설정해주세요.');
			return;
		}
		const userData = {
			id: user.id,
			email: user.email,
			password: user.password,
			name: user.name,
		};

		try {
			await trans.put('/api/join', userData);
			toast.success('회원가입 성공! 로그인 페이지로 이동합니다.');
		} catch (error) {
			toast.warning('회원가입 실패:', error);
		}
	};

	return (
		<>
			<ToastContainer
				position="top-center"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<Container className="mt-5">
				<Row className="justify-content-md-center">
					<Col xs={12} md={6}>
						<Form onSubmit={handleSubmit}>
							<Form.Group controlId="username">
								<Form.Label>아이디</Form.Label>
								<Form.Control type="text" placeholder="Enter username" name="id" value={user.id} onChange={handleChange} />
							</Form.Group>

							<Form.Group controlId="email">
								<Form.Label>이메일</Form.Label>
								<Form.Control type="email" placeholder="Enter email" name="email" value={user.email} onChange={handleChange} />
							</Form.Group>

							<Form.Group controlId="name">
								{' '}
								{/* 이름 입력 필드 추가 */}
								<Form.Label>이름</Form.Label>
								<Form.Control type="text" placeholder="Enter your name" name="name" value={user.name} onChange={handleChange} />
							</Form.Group>

							<Form.Group controlId="password">
								<Form.Label>비밀번호</Form.Label>
								<Form.Control type="password" placeholder="Password" name="password" value={user.password} onChange={handleChange} />
							</Form.Group>

							<Button variant="primary" type="submit">
								회원가입
							</Button>
						</Form>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Join;
