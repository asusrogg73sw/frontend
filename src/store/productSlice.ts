import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

// 1. Fetch All Products Action
export const listProducts = createAsyncThunk(
  "products/list",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/products");
      return response.data; // Backend se products ka array aayega
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

// 3. Create Product Action
export const createProduct = createAsyncThunk(
  "products/create",
  async (productData: any, { rejectWithValue }) => {
    try {
      const response = await API.post("/products", productData);
      return response.data; // Naya bana hua product
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product",
      );
    }
  },
);

// 2. Delete Product Action
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await API.delete(`/products/${id}`);
      return id; // Hum ID return kar rahe hain taake state se filter kar saken
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.products = action.payload.products;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p: any) => p._id !== action.payload,
        );
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [action.payload, ...state.products];
      });
  },
});

export default productSlice.reducer;
