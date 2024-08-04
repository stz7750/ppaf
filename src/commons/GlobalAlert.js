/**
 *packageName    : stz-
 * fileName       : GlobalAlert.js
 * author         : stz
 * date           : 8/4/24
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 8/4/24        stz       최초 생성
 */
import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, LinearProgress, Box } from '@mui/material';
//README : 첫번째는 해당 내용이 되고 level은 alert의 중요도를 나타냅니다. 세번째는 alert의 표출 시간이 됩니다.
const GlobalAlert = ({ message, level, duration = 6000 }) => {
	const [open, setOpen] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		setOpen(true); // 컴포넌트가 마운트되면 알럿을 표시

		const timer = setInterval(() => {
			setProgress(prevProgress => (prevProgress >= 100 ? 100 : prevProgress + 100 / (duration / 100)));
		}, 100);

		const autoHideTimer = setTimeout(() => {
			setOpen(false);
		}, duration);

		return () => {
			clearInterval(timer);
			clearTimeout(autoHideTimer);
		};
	}, [duration]);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	return (
		<Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
			<Alert onClose={handleClose} severity={level} sx={{ width: '100%' }}>
				{message}
				<Box sx={{ width: '100%', mt: 1 }}>
					<LinearProgress variant="determinate" value={progress} />
				</Box>
			</Alert>
		</Snackbar>
	);
};

export default GlobalAlert;
