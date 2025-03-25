import { createSlice } from "@reduxjs/toolkit";

const getCartKey = (email) => (email ? `cart_${email}` : "cart_guest");

const initialState = {
  cartItems: [],
  showCart: false,
  totalQuantity: 0,
  currentUserEmail: null,
};

const loadCart = (email) => {
  if (typeof window === "undefined") return initialState;
  const key = getCartKey(email);
  const savedCart = localStorage.getItem(key);
  return savedCart ? JSON.parse(savedCart) : initialState;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart(state, action) {
      const { email } = action.payload;
      const loadedCart = loadCart(email);
      return {
        ...loadedCart,
        currentUserEmail: email,
        showCart: state.showCart, 
      };
    },
    addCart(state, action) {
      const { newItem } = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
        existingItem.totalPrice = parseFloat(
          (existingItem.price * existingItem.quantity).toFixed(2)
        );
      } else {
        state.cartItems.push({
          ...newItem,
          quantity: newItem.quantity || 1,
          totalPrice: parseFloat(
            (newItem.price * (newItem.quantity || 1)).toFixed(2)
          ),
        });
      }
      state.totalQuantity += newItem.quantity || 1;
    },
    removeCart(state, action) {
      const { itemId } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === itemId);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
      }
    },
    updateQuantity(state, action) {
      const { id, newQuantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        const quantityDifference = newQuantity - existingItem.quantity;
        existingItem.quantity = newQuantity;
        existingItem.totalPrice = parseFloat(
          (existingItem.price * newQuantity).toFixed(2)
        );
        state.totalQuantity += quantityDifference;
      }
    },
    toggleCart(state) {
      state.showCart = !state.showCart;
    },
    clearCart(state) {
      state.cartItems = [];
      state.totalQuantity = 0;
    },
    saveCart(state) {
      if (state.currentUserEmail && typeof window !== "undefined") {
        localStorage.setItem(
          getCartKey(state.currentUserEmail),
          JSON.stringify({
            cartItems: state.cartItems,
            totalQuantity: state.totalQuantity,
            showCart: state.showCart,
          })
        );
      }
    },
  },
});

const cartMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith("cart/") && !action.type.endsWith("saveCart")) {
    store.dispatch(cartActions.saveCart());
  }
  return result;
};

export { cartMiddleware };
export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
