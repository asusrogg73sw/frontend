import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

// NEW FIX: Defined an interface matching the backend model to remove 'any'
interface UserState {
  _id: string;
  name: string;
  email: string;
  age: number;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 1. Fetch All Users (Admin Only)
export const listUsers = createAsyncThunk(
  "users/list",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/users");
      return response.data; // Users ka array
    } catch (error: unknown) { 
      // NEW FIX: Replaced 'any' with 'unknown' and safe type casting for Axios error
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

// 2. Delete User (Admin Only)
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await API.delete(`/users/${id}`);
      return id; // Return ID taake state se filter ho sake
    } catch (error: unknown) {
      // NEW FIX: Replaced 'any' with 'unknown'
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete user",
      );
    }
  },
);

// 3. Toggle Admin Role (Admin Only)
export const toggleAdminRole = createAsyncThunk(
  "users/toggleAdmin",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await API.put(`/users/${id}/toggle-admin`);
      return response.data; // Updated user object
    } catch (error: unknown) {
      // NEW FIX: Replaced 'any' with 'unknown'
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user role",
      );
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [] as UserState[], // NEW FIX: Used 'UserState[]' instead of 'any[]'
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Users
      .addCase(listUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        // NEW FIX: Corrected explicit parameter type 'u: any' to 'UserState'
        state.users = state.users.filter((u: UserState) => u._id !== action.payload);
      })
      // Toggle Admin Role
      .addCase(toggleAdminRole.fulfilled, (state, action) => {
        // NEW FIX: Corrected explicit parameter type 'u: any' to 'UserState'
        const index = state.users.findIndex(
          (u: UserState) => u._id === action.payload._id,
        );
        if (index !== -1) {
          state.users[index] = action.payload; // Live status update
        }
      });
  },
});

export default userSlice.reducer;