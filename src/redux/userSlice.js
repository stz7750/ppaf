import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    authToken: '',
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.userInfo = action.payload.user;
      state.authToken = action.payload.token;
    },
    logout: (state) => {
      state.userInfo = null;
      state.authToken = '';
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
