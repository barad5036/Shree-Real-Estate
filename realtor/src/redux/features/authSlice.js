import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("token");
const initialUser = (() => {
  try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
})();

const initialState = {
  isAuthenticated: !!initialToken,
  token: initialToken || null,
  user: initialUser || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setActiveUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
      state.isAuthenticated = true;
    },
  },
});

export const { login, logout, setActiveUser } = authSlice.actions;

export default authSlice.reducer;
