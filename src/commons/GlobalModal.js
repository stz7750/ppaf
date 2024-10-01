import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

function GlobalModal({ show, setShow, title, data, footer, src, children }) {
	const closeModal = () => {
		setShow(false);
	};

	return (
		<Modal open={show} onClose={() => setShow(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 400,
					bgcolor: 'rgba(0, 0, 0, 0.7)', // 반투명한 검은색 배경 설정
					color: '#ffffff',
					boxShadow: 24,
					p: 4,
				}}
			>
				<Box display="flex" alignItems="center" mb={2}>
					<img src={src || '/images/mainIcon.png'} alt="Modal Icon" />
					<Typography id="modal-title" variant="h6" component="h2" sx={{ ml: 1 }}>
						{title}
					</Typography>
				</Box>
				<Box id="modal-description" sx={{ mb: 2 }}>
					{children ? (
						children
					) : (
						<>
							<Typography>{data.data1}</Typography>
							<Typography>{data.data2}</Typography>
						</>
					)}
				</Box>
				<Box>{footer ? footer : <button onClick={closeModal}>닫기</button>}</Box>
			</Box>
		</Modal>
	);
}

export default GlobalModal;
