import React, { useState } from 'react';
import { Box, Grid, Button, TextField, Typography, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { login } from '../redux/userSlice';
import { styled } from '@mui/system';
import trans from '../commons/trans';

const theme = createTheme();

const AnimationBox = styled(Box)(({ theme }) => ({
	transition: 'all 0.5s ease-in-out',
	position: 'absolute',
	width: '50%',
	height: '100%',
	top: 0,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	textAlign: 'center',
	backgroundColor: 'transparent',
}));

const FormContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	padding: '20px',
	backgroundColor: 'transparent',
}));

function Login() {
	const [id, setId] = useState('');
	const [password, setPassword] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const toggleSignUp = () => {
		setIsSignUp(!isSignUp);
	};

	const handleSubmit = async event => {
		event.preventDefault();
		const form = new FormData();
		form.append('username', id);
		form.append('password', password);
		try {
			const response = await trans.post('/api/login', { username: id, password });
			if (response.data) {
				console.log(response.data, '지금부터 여기 이용');
				localStorage.setItem('authToken', response.data.accessToken);
				dispatch(
					login({
						id,
						pw: password,
					})
				);
				navigate('/main');
			} else {
				toast.error('로그인 실패: 서버 응답이 없음');
			}
		} catch (error) {
			toast.error('로그인 실패: ' + error.message);
		}
	};

	const handleSignUp = async event => {
		event.preventDefault();
		// 회원가입 처리 로직 추가
		toast.success('회원가입 성공');
	};

	return (
		<ThemeProvider theme={theme}>
			<Grid container component="main" sx={{ height: '100vh', position: 'relative' }}>
				<AnimationBox sx={{ left: isSignUp ? '50%' : 0, backgroundColor: isSignUp ? 'black' : 'grey.800', color: 'white' }}>
					<FormContainer>
						{!isSignUp ? (
							<>
								<Typography component="h1" variant="h3" className="press-start-2p-regular" sx={{ color: 'white' }}>
									환영 당신을!
								</Typography>
								<Typography component="h2" variant="h5" className="press-start-2p-regular" sx={{ mt: 2, color: 'white' }}>
									국제 설치류 보호 단체
								</Typography>
								<Button variant="outlined" color="inherit" className="press-start-2p-regular" sx={{ mt: 3 }} onClick={toggleSignUp}>
									계정이 없으신가요? 가입하기
								</Button>
							</>
						) : (
							<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, backgroundColor: 'transparent' }}>
								<Typography component="h1" variant="h5" className="press-start-2p-regular" sx={{ color: 'green', fontFamily: "'Press Start 2P', system-ui" }}>
									Sign In
								</Typography>
								<TextField
									margin="normal"
									required
									fullWidth
									id="username"
									label="아이디"
									name="username"
									autoFocus
									value={id}
									onChange={e => setId(e.target.value)}
									InputProps={{
										style: {
											backgroundColor: 'transparent',
											color: 'white',
											fontFamily: "'Press Start 2P', system-ui",
										},
									}}
									InputLabelProps={{
										style: {
											color: 'white',
											fontFamily: "'Press Start 2P', system-ui",
										},
									}}
								/>
								<TextField
									margin="normal"
									required
									fullWidth
									name="password"
									label="비밀번호"
									type="password"
									id="password"
									autoComplete="current-password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									InputProps={{
										style: {
											backgroundColor: 'transparent',
											color: 'white',
											fontFamily: "'Press Start 2P', system-ui",
										},
									}}
									InputLabelProps={{
										style: {
											color: 'white',
											fontFamily: "'Press Start 2P', system-ui",
										},
									}}
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									className="press-start-2p-regular"
									sx={{
										mt: 3,
										mb: 2,
										background: 'black.700',
										backgroundColor: 'green',
										color: 'black',
									}}
									/*disabled={!id || !password}*/
								>
									Continue
								</Button>
							</Box>
						)}
					</FormContainer>
				</AnimationBox>
				<AnimationBox sx={{ left: isSignUp ? 0 : '50%', backgroundColor: isSignUp ? 'grey.800' : 'black', color: 'white' }}>
					<FormContainer>
						{isSignUp ? (
							<>
								<Typography component="h1" variant="h3" className="press-start-2p-regular" sx={{ color: 'white' }}>
									안녕?
								</Typography>
								<Typography component="h2" variant="h5" className="press-start-2p-regular" sx={{ mt: 2, color: 'white' }}>
									환영해!
								</Typography>
								<Button variant="outlined" color="inherit" className="press-start-2p-regular" sx={{ mt: 3 }} onClick={toggleSignUp}>
									로그인
								</Button>
							</>
						) : (
							<Box component="form" onSubmit={handleSignUp} noValidate sx={{ mt: 1, backgroundColor: 'transparent' }}>
								<Typography component="h1" variant="h5" className="press-start-2p-regular" sx={{ color: 'white', fontFamily: "'Press Start 2P', system-ui" }}>
									Sign Up
								</Typography>
								<TextField
									margin="normal"
									required
									fullWidth
									id="id"
									label="Email Address"
									name="id"
									autoFocus
									InputProps={{
										style: {
											backgroundColor: 'transparent',
											color: 'white',
											fontFamily: "'Press Start 2P', system-ui",
										},
									}}
									InputLabelProps={{
										style: {
											color: 'white',
											fontFamily: "'Press Start 2P', system-ui",
										},
									}}
								/>
								<TextField
									margin="normal"
									required
									fullWidth
									name="signUpPassword"
									label="Password"
									type="password"
									id="signUpPassword"
									autoComplete="new-password"
									InputProps={{
										style: {
											backgroundColor: 'transparent',
											color: 'white',
											fontFamily: "'Press Start 2P', system-ui",
										},
									}}
									InputLabelProps={{
										style: {
											color: 'white',
											fontFamily: "'Press Start 2P', system-ui",
										},
									}}
								/>
								<TextField
									margin="normal"
									required
									fullWidth
									name="confirmPassword"
									label="Confirm Password"
									type="password"
									id="confirmPassword"
									autoComplete="new-password"
									InputProps={{
										style: {
											backgroundColor: 'transparent',
											color: 'white',
											fontFamily: "'Press Start 2P', system-ui",
										},
									}}
									InputLabelProps={{
										style: {
											color: 'white',
											fontFamily: "'Press Start 2P', system-ui",
										},
									}}
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									className="press-start-2p-regular"
									background={'green'}
									sx={{
										mt: 3,
										mb: 2,
										background: 'black.700',
										backgroundColor: 'green',
										color: 'black',
									}}
								>
									Sign Up
								</Button>
							</Box>
						)}
					</FormContainer>
				</AnimationBox>
			</Grid>
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
		</ThemeProvider>
	);
}

export default Login;
