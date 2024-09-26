/**
 *packageName    : stz-
 * fileName       : MapPosition.js
 * author         : stz
 * date           : 9/25/24
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 9/25/24        stz       최초 생성
 */
// MapPosition.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { FaLocationArrow, FaMapMarkerAlt } from 'react-icons/fa'; // Importing React Icons for longitude and latitude

const MapPosition = ({ longitude, latitude }) => {
	return (
		<Box
			sx={{
				position: 'absolute',
				bottom: 10,
				right: 10,
				backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slightly transparent background
				padding: '10px',
				borderRadius: '8px',
				display: 'flex',
				alignItems: 'center',
				gap: '10px',
			}}
		>
			{/* Longitude with Icon */}
			<Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
				<FaLocationArrow /> {longitude ? `경도: ${longitude.toFixed(4)}` : '경도: N/A'}
			</Typography>

			{/* Latitude with Icon */}
			<Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
				<FaMapMarkerAlt /> {latitude ? `위도: ${latitude.toFixed(4)}` : '위도: N/A'}
			</Typography>
		</Box>
	);
};

export default MapPosition;
