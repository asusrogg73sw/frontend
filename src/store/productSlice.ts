import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

// 1. Fetch All Products Action
export const listProducts = createAsyncThunk('products/list', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/products');
    return response.data; // Backend se products ka array aayega
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

const productSlice = createSlice({
  name: 'products',
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
      });
  },
});

export default productSlice.reducer;