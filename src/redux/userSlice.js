import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
  id : '',
  pw : '',
  role : ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers : {
    login : (state, action) => {
      return {id : action.payload.id, pw : action.payload.pw, role: action.payload.role, meessage : toast.warning("로그인 성공")}
    },
    logout : () => {
      console.log("logout했다.");
      return {...initialState}
    }
  }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
