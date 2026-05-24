// src/store/orderSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

// 1. Fetch All Orders Action (Admin Only)
export const listOrders = createAsyncThunk(
  "orders/list",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/orders");
      return response.data; // Orders ka array
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// 2. Deliver Order Action (Admin Only)
export const deliverOrder = createAsyncThunk(
  "orders/deliver",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await API.put(`/orders/${id}/deliver`);
      return response.data; // Updated order object
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to deliver order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Orders Cases
      .addCase(listOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(listOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Deliver Order Case
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.loading = false;
        // State mein us order ko dhoond kar updated data (isDelivered: true) se replace kar do
        const index = state.orders.findIndex((o: any) => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export default orderSlice.reducer;