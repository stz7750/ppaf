/*
 * Copyright (c) 2024. &copy; STZ. All rights reserved
 */

/**
 *packageName    : stz-
 * fileName       : BtnMaker.js
 * author         : stz
 * date           : 10/7/24
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 10/7/24        stz       최초 생성
 */
import React from 'react';
import IconButton from '@mui/material/IconButton';
import BrowserUpdatedOutlinedIcon from '@mui/icons-material/BrowserUpdatedOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';

const BtnMaker = ({ opt }) => {
	const { type, style, text, size, onClick } = opt;

	const renderButton = () => {
		switch (type) {
			case 'fileUpload':
				return (
					<IconButton component="label" style={style} size={size}>
						<CloudUploadIcon />
						<input type="file" hidden onChange={event => console.log(event.target.files)} multiple />
					</IconButton>
				);
			case 'delete':
				return (
					<IconButton onClick={onClick} style={style} size={size}>
						<DeleteIcon />
					</IconButton>
				);
			case 'send':
				return (
					<IconButton onClick={onClick} style={style} size={size}>
						<SendIcon />
					</IconButton>
				);
			case 'search':
				return (
					<IconButton onClick={onClick} style={style} size={size}>
						<SearchIcon />
					</IconButton>
				);
			case 'download':
				return (
					<IconButton onClick={onClick} style={style} size={size}>
						<BrowserUpdatedOutlinedIcon />
					</IconButton>
				);
			default:
				return null;
		}
	};

	return <>{renderButton()}</>;
};

export default BtnMaker;
