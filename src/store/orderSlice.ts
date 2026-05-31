// src/store/orderSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

// --- TYPES & INTERFACES ---

export interface OrderItem {
  product: string;
  name: string;
  qty: number;
  image: string;
  price: number;
}

export interface Order {
  _id: string;
  user: string; 
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice?: number; 
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;      
  isDelivered: boolean;
  deliveredAt?: string;  
  createdAt?: string;    
}

interface OrderState {
  orders: Order[]; 
  loading: boolean; 
  error: string | null; 
}

// --- ASYNC THUNKS (API Calls) ---

// 1. Fetch All Orders Action (Admin Only)
export const listOrders = createAsyncThunk<Order[], void>(
  "orders/list",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/orders");
      return response.data;
    } catch (error: unknown) {
      const errMsg = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        errMsg.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

// Fetch Authenticated Customer Orders
export const listMyOrders = createAsyncThunk<Order[], void>(
  "orders/listMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/orders/myorders");
      return response.data;
    } catch (error: unknown) {
      const errMsg = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        errMsg.response?.data?.message || "Failed to fetch your orders",
      );
    }
  },
);

// 2. Deliver Order Action (Admin Only)
export const deliverOrder = createAsyncThunk<Order, string>(
  "orders/deliver",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await API.put(`/orders/${id}/deliver`);
      return response.data;
    } catch (error: unknown) {
      const errMsg = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        errMsg.response?.data?.message || "Failed to deliver order",
      );
    }
  },
);

// 3. Create New Order Action
export const createOrder = createAsyncThunk<Order, Partial<Order>>(
  "orders/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await API.post("/orders", orderData);
      return response.data;
    } catch (error: unknown) {
      const errMsg = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        errMsg.response?.data?.message || "Failed to place order",
      );
    }
  },
);

// 🚀 NEW FIX: 4. Delete/Cancel Order Action Thunk
// Id pass karenge backend ko aur return mein deleted order ki ID bhejenge core mapping ke liye
export const deleteOrder = createAsyncThunk<string, string>(
  "orders/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await API.delete(`/orders/${id}`);
      return id; // Fulfilled case ke liye raw id return ki
    } catch (error: unknown) {
      const errMsg = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        errMsg.response?.data?.message || "Failed to cancel order",
      );
    }
  },
);

// --- SLICE CONFIGURATION ---

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === List Orders Cases ===
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

      // === List My Orders Cases ===
      .addCase(listMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; 
      })
      .addCase(listMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // === Deliver Order Case ===
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id,
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })

      // === Create Order Case ===
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })

      // 🚀 NEW FIX: === Delete Order Cases ===
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Global state se immediate filter karkay component arrays clean kar diye bina refresh kiye
        state.orders = state.orders.filter((order) => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;