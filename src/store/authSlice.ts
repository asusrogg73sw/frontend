import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

// 1. Login Action
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await API.post("/users/login", userData);
      // User info (name, email, isAdmin) UI ke liye save kar rahe hain
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

// 2. Logout Action (Ab ye backend cookie ko bhi uraye ga)
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await API.post("/users/logout");
      localStorage.removeItem("userInfo");
    } catch (error: any) {
      return rejectWithValue("Logout failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo")!)
      : null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login flow
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout flow
      .addCase(logoutUser.fulfilled, (state) => {
        state.userInfo = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
