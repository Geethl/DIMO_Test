import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + item.qty } : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cart');
    },
    updateQuantity: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cartItems.find(x => x._id === id);
      if (item) item.qty = qty;
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    }
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
