import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

/* =========================================================
   // NEW: Product Type
   ========================================================= */
interface Product {
  _id: string;
  name: string;
  price: number;
  brand?: string;
  category?: string;
  description?: string;
  image?: string;
  countInStock?: number;
}

/* =========================================================
   // NEW: Product State Type
   ========================================================= */
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  productDetails: Product | null;
}

/* =========================================================
   1. Fetch All Products
   ========================================================= */
export const listProducts = createAsyncThunk(
  "products/list",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/products");

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

/* =========================================================
   2. Create Product
   ========================================================= */
export const createProduct = createAsyncThunk(
  "products/create",
  async (productData: any, { rejectWithValue }) => {
    try {
      const response = await API.post("/products", productData);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product",
      );
    }
  },
);

/* =========================================================
   3. Delete Product
   ========================================================= */
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await API.delete(`/products/${id}`);

      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  },
);

/* =========================================================
   4. Fetch Single Product Details
   ========================================================= */
export const getProductDetails = createAsyncThunk(
  "products/details",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/${id}`);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details",
      );
    }
  },
);

/* =========================================================
   5. Update Product
   ========================================================= */
export const updateProductAction = createAsyncThunk(
  "products/update",
  async (
    {
      id,
      productData,
    }: {
      id: string;
      productData: any;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await API.put(`/products/${id}`, productData);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product",
      );
    }
  },
);

/* =========================================================
   // NEW: Properly Typed Initial State
   ========================================================= */
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  productDetails: null,
};

/* =========================================================
   Product Slice
   ========================================================= */
const productSlice = createSlice({
  name: "products",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* =====================================================
         LIST PRODUCTS
         ===================================================== */
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;

        // NEW: Safe fallback
        state.products = action.payload.products || [];
      })

      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* =====================================================
         CREATE PRODUCT
         ===================================================== */
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;

        // Ab error nahi aayega
        state.products = [action.payload, ...state.products];
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* =====================================================
         DELETE PRODUCT
         ===================================================== */
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;

        // NEW: Proper Product typing
        state.products = state.products.filter(
          (p) => p._id !== action.payload,
        );
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* =====================================================
         GET PRODUCT DETAILS
         ===================================================== */
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;

        state.productDetails = action.payload;
      })

      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* =====================================================
         UPDATE PRODUCT
         ===================================================== */
      .addCase(updateProductAction.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateProductAction.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.products.findIndex(
          (p) => p._id === action.payload._id,
        );

        // Ab ye bhi error nahi dega
        if (index !== -1) {
          state.products[index] = action.payload;
        }

        state.productDetails = action.payload;
      })

      .addCase(updateProductAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;