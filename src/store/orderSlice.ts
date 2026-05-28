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

// Database se aane wale mukammal Order Object ka structure
export interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice?: number; // NEW FIX: taxPrice ko optional (?) kiya taake agar client se missing ho to error na aaye
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
}

// Order Slice ki state ka structure
interface OrderState {
  orders: Order[]; // Tamam orders ki list array
  loading: boolean; // Loading spinner status
  error: string | null; // Error message store karne ke liye
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
      });
  },
});

export default orderSlice.reducer;