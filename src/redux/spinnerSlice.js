/**
 *packageName    : stz-
 * fileName       : spinnerSlice
 * author         : stz
 * date           : 10/3/24
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 10/3/24        stz       최초 생성
 */
// src/redux/spinnerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const spinnerSlice = createSlice({
	name: 'spinner',
	initialState: { isLoading: false },
	reducers: {
		showSpinner: state => {
			state.isLoading = true;
		},
		hideSpinner: state => {
			state.isLoading = false;
		},
	},
});

export const { showSpinner, hideSpinner } = spinnerSlice.actions;
export default spinnerSlice.reducer;
