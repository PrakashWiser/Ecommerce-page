import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    showCart: false,
    totalQuantity: 0,
  },
  reducers: {
    addCart(state, action) {
      const newItems = action.payload;
      const existingItems = state.cartItems.find(
        (item) => item.id === newItems.id
      );

      if (existingItems) {
        existingItems.quantity += 1;
        existingItems.totalPrice += newItems.price;
      } else {
        state.cartItems.push({
          id: newItems.id,
          name: newItems.name,
          price: newItems.price,
          listingType: newItems.listingType,
          quantity: 1,
          totalPrice: newItems.price,
          image: newItems.image,
        });
        state.totalQuantity++;
      }
    },
    removeCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      state.totalQuantity--;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
