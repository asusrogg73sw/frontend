import { createSlice } from "@reduxjs/toolkit";
// FIX: Jab 'verbatimModuleSyntax' enabled ho, to types ko 'import type' ke sath mangwana zaroori hai
import type { PayloadAction } from "@reduxjs/toolkit";

// Cart ke single item ka structure (Type safety ke liye)
export interface CartItem {
  product: string; // Product ki unique ID (MongoDB ID)
  name: string; // Product ka naam
  image: string; // Product ki image ka URL
  price: number; // Product ki qeemat
  countInStock: number; // Stock mein kitne items bache hain
  qty: number; // User ne kitne quantity select ki hai
}

// Cart state ka main structure
interface CartState {
  cartItems: CartItem[]; // Items ki array, jo CartItem type ki hogi
}

// NEW FIX: LocalStorage se safe data parsing taake runtime par parsing crash na ho
const loadCartFromStorage = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
  } catch (error) {
    console.error("Failed to parse cart items from localStorage", error);
    return [];
  }
};

const initialState: CartState = {
  cartItems: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 1. Cart mein item add ya update karne ka function
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload; // Jo naya item add karna hai

      // Check kar rahe hain ke kya ye item pehle se cart mein maujood hai?
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        // Agar item pehle se hai, to purane item ko naye data (updated quantity) se badal do
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x,
        );
      } else {
        // Agar item naya hai, to cartItems array mein push (add) kar do
        state.cartItems.push(item);
      }
      // Updated cart ko LocalStorage mein save kar rahe hain taake page refresh par data na urey
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // 2. Cart se item delete karne ka function
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload,
      );

      // Nayi list ko LocalStorage mein overwrite kar rahe hain
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // 3. Poora cart khali karne ka function (e.g., Order complete hone ke baad)
    clearCart: (state) => {
      state.cartItems = []; // State khali kar di
      localStorage.removeItem("cartItems"); // LocalStorage se data ura diya
    },
  },
});

// Actions aur Reducer ko export kar rahe hain taake store aur components mein use ho sakein
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;