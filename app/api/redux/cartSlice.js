import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  if (typeof window === "undefined") {
    return {
      cartItems: [],
      showCart: false,
      totalQuantity: 0,
    };
  }

  const savedCart = localStorage.getItem("cart");
  return savedCart
    ? JSON.parse(savedCart)
    : {
        cartItems: [],
        showCart: false,
        totalQuantity: 0,
      };
};

const saveCart = (cart) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

const initialState = loadCart();
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = parseFloat(
          (existingItem.totalPrice + newItem.price).toFixed(2)
        );
      } else {
        state.cartItems.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          listingType: newItem.listingType,
          quantity: 1,
          totalPrice: newItem.price,
          image: newItem.image,
        });
      }
      state.totalQuantity += 1;
      saveCart(state);
    },
    removeCart(state, action) {
      const itemId = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === itemId);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
        saveCart(state);
      }
    },
    toggleCart(state) {
      state.showCart = !state.showCart;
      saveCart(state);
    },
    clearCart(state) {
      state.cartItems = [];
      state.totalQuantity = 0;
      saveCart(state);
    },
    updateCartFromStorage(state, action) {
      return action.payload;
    },
  },
});

export const setupCartSync = (store) => {
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === "cart") {
        const newCart = JSON.parse(event.newValue);
        store.dispatch(cartActions.updateCartFromStorage(newCart));
      }
    });
  }
};

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
