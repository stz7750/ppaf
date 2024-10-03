import React from 'react';
import spinnerGif from '../images/spinner.gif';
import { useSelector } from 'react-redux'; // 스피너 이미지 경로

const Spinner = () => {
	const isLoading = useSelector(state => state.spinner.isLoading);

	if (!isLoading) return null;

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 1000,
			}}
		>
			<img src={`${process.env.PUBLIC_URL}/images/spinner.gif`} alt="Loading..." style={{ width: '100px' }} />
		</div>
	);
};

export default Spinner;
