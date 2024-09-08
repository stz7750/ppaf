/**
 * packageName    : stz-
 * fileName       : InputMaker.js
 * author         : stz
 * date           : 9/8/24
 * description    : MUI와 React Icons를 사용하여 동적으로 여러 입력 필드를 생성 (방어 로직 추가)
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 9/8/24        stz       최초 생성
 */
import React from 'react';
import { InputAdornment, TextField } from '@mui/material';

const InputMaker = ({ opt }) => {
	const options = opt || [];

	return (
		<>
			{options.length > 0 ? (
				options.map((inputOpt, index) => {
					const { type, label, placeholder, name, icon } = inputOpt;

					return (
						<TextField
							key={index}
							label={label}
							type={type || 'text'}
							placeholder={placeholder || ''}
							name={name || `input-${index}`}
							variant="outlined"
							fullWidth
							margin="normal"
							InputProps={{
								startAdornment: icon ? <InputAdornment position="start">{icon}</InputAdornment> : null,
							}}
						/>
					);
				})
			) : (
				<p>데이터의 오류가 생겼습니다.</p>
			)}
		</>
	);
};

export default InputMaker;
