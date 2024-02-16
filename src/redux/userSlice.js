import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id : '',
  pw : ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers : {
    login : (state, action) => {
      console.log("login했다.");
      console.log(action.payload);
      console.log("---------------------")
      return {id : action.payload.id, pw : action.payload.pw}
    },
    logout : () => {
      console.log("logout했다.");
      return {...initialState}
    }
  }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
