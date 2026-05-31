import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

interface LoginCredentials {
  email: string;
  password?: string;
  [key: string]: unknown;
}

// 1. Login Action
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await API.post("/users/login", userData);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

// 2. Logout Action
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await API.post("/users/logout");
      localStorage.removeItem("userInfo");
    } catch { 
      // NEW FIX: Catch block se variable completely remove kar diya taake unused-vars error permanently khatam ho jaye
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