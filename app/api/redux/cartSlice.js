import { createSlice } from "@reduxjs/toolkit";

const getCartKey = (email) => (email ? `cart_${email}` : "cart_guest");

const initialState = {
  cartItems: [],
  showCart: false,
  totalQuantity: 0,
  currentUserEmail: null,
  lastError: null,
};

const MAX_QUANTITY = 10;
const loadCart = (email) => {
  if (typeof window === "undefined") return initialState;
  try {
    const key = getCartKey(email);
    const savedCart = localStorage.getItem(key);
    return savedCart ? JSON.parse(savedCart) : initialState;
  } catch (error) {
    console.error("Failed to load cart:", error);
    return { ...initialState, lastError: error.message };
  }
};

const saveToLocalStorage = (state) => {
  if (typeof window === "undefined" || !state.currentUserEmail) return false;
  try {
    const key = getCartKey(state.currentUserEmail);
    const dataToSave = {
      cartItems: state.cartItems,
      totalQuantity: state.totalQuantity,
      showCart: state.showCart,
    };
    localStorage.setItem(key, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error("Failed to save cart:", error);
    return false;
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart(state, action) {
      const { email } = action.payload || {};
      if (!email) {
        state.lastError = "Email required for cart initialization";
        return;
      }

      const loadedCart = loadCart(email);
      state.cartItems = loadedCart.cartItems || [];
      state.totalQuantity = loadedCart.totalQuantity || 0;
      state.showCart = loadedCart.showCart || false;
      state.currentUserEmail = email;
      state.lastError = null;
    },
    addCart(state, action) {
      const { newItem } = action.payload || {};

      if (!newItem?.id || !newItem?.price) {
        state.lastError = "Invalid item: must have id and price";
        console.error(state.lastError);
        return;
      }

      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );
      const quantityToAdd = Math.max(
        1,
        Math.min(newItem.quantity || 1, MAX_QUANTITY)
      );

      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity + quantityToAdd,
          MAX_QUANTITY
        );
        existingItem.quantity = newQuantity;
        existingItem.totalPrice = parseFloat(
          (existingItem.price * newQuantity).toFixed(2)
        );
      } else {
        state.cartItems.push({
          ...newItem,
          quantity: quantityToAdd,
          totalPrice: parseFloat((newItem.price * quantityToAdd).toFixed(2)),
        });
      }
      state.totalQuantity += quantityToAdd;
      state.lastError = null;
      saveToLocalStorage(state);
    },
    removeCart(state, action) {
      const { itemId } = action.payload || {};
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === itemId
      );

      if (existingItemIndex !== -1) {
        const existingItem = state.cartItems[existingItemIndex];
        state.totalQuantity -= existingItem.quantity;
        state.cartItems.splice(existingItemIndex, 1);
        state.lastError = null;
        saveToLocalStorage(state);
      } else {
        state.lastError = `Item with id ${itemId} not found`;
      }
    },
    updateQuantity(state, action) {
      const { id, newQuantity } = action.payload || {};
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (!existingItem) {
        state.lastError = `Item with id ${id} not found`;
        return;
      }

      if (newQuantity >= 0) {
        const validatedQuantity = Math.min(
          Math.max(0, newQuantity),
          MAX_QUANTITY
        );
        const quantityDifference = validatedQuantity - existingItem.quantity;
        existingItem.quantity = validatedQuantity;
        existingItem.totalPrice = parseFloat(
          (existingItem.price * validatedQuantity).toFixed(2)
        );
        state.totalQuantity += quantityDifference;
        state.lastError = null;
        saveToLocalStorage(state);
      } else {
        state.lastError = "Quantity cannot be negative";
      }
    },
    toggleCart(state) {
      state.showCart = !state.showCart;
      saveToLocalStorage(state);
    },
    clearCart(state) {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.showCart = false;
      state.lastError = null;
      if (state.currentUserEmail) {
        saveToLocalStorage(state);
      }
    },
    resetCartState(state) {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.showCart = false;
      state.currentUserEmail = null;
      state.lastError = null;
      localStorage.removeItem(getCartKey(state.currentUserEmail));
    },
  },
});

const cartMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  console.log("Cart Action:", action.type, "State:", store.getState().cart);
  return result;
};

export { cartMiddleware };
export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
