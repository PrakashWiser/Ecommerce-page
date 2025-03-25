import { createSlice } from "@reduxjs/toolkit";

const getCartKey = (email) => {
  return email ? `cart_${email}` : 'cart_guest';
};

const loadCart = (email) => {
  if (typeof window === "undefined") {
    return {
      cartItems: [],
      showCart: false,
      totalQuantity: 0,
    };
  }

  const key = getCartKey(email);
  const savedCart = localStorage.getItem(key);
  return savedCart
    ? JSON.parse(savedCart)
    : {
        cartItems: [],
        showCart: false,
        totalQuantity: 0,
      };
};

const saveCart = (cart, email) => {
  if (typeof window !== "undefined") {
    const key = getCartKey(email);
    localStorage.setItem(key, JSON.stringify(cart));
  }
};

const initialState = loadCart(null);
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart(state, action) {
      const { newItem, userEmail } = action.payload;
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
      saveCart(state, userEmail);
    },
    removeCart(state, action) {
      const { itemId, userEmail } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === itemId);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
        saveCart(state, userEmail);
      }
    },
    updateQuantity(state, action) {
      const { id, newQuantity, userEmail } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        const quantityDifference = newQuantity - existingItem.quantity;
        existingItem.quantity = newQuantity;
        existingItem.totalPrice = parseFloat(
          (existingItem.price * newQuantity).toFixed(2)
        );
        state.totalQuantity += quantityDifference;
        saveCart(state, userEmail);
      }
    },
    toggleCart(state) {
      state.showCart = !state.showCart;
    },
    clearCart(state, action) {
      const { userEmail } = action.payload;
      state.cartItems = [];
      state.totalQuantity = 0;
      saveCart(state, userEmail);
    },
    updateCartFromStorage(state, action) {
      return action.payload;
    },
    loadUserCart(state, action) {
      const { email } = action.payload;
      return loadCart(email);
    },
  },
});

export const setupCartSync = (store) => {
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key.startsWith("cart_")) {
        const newCart = JSON.parse(event.newValue);
        store.dispatch(cartActions.updateCartFromStorage(newCart));
      }
    });
  }
};

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;