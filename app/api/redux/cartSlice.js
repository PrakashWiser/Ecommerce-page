import { createSlice } from "@reduxjs/toolkit";

const getCartKey = (email) => (email ? `cart_${email}` : "cart_guest");

const initialState = {
  cartItems: [],
  showCart: false,
  totalQuantity: 0,
  currentUserEmail: null,
  lastError: null,
};

const loadCart = (email) => {
  if (typeof window === "undefined") return initialState;
  try {
    const key = getCartKey(email);
    const savedCart = localStorage.getItem(key);
    return savedCart ? JSON.parse(savedCart) : initialState;
  } catch (error) {
    console.error('Failed to load cart:', error);
    return { ...initialState, lastError: error.message };
  }
};

const saveToLocalStorage = (state) => {
  if (typeof window === "undefined" || !state.currentUserEmail) return;
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
    console.error('Failed to save cart:', error);
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
        state.lastError = 'Email required for cart initialization';
        return state;
      }
      const loadedCart = loadCart(email);
      return {
        ...loadedCart,
        currentUserEmail: email,
        showCart: state.showCart,
        lastError: null,
      };
    },
    addCart(state, action) {
      const { newItem } = action.payload || {};
      
      if (!newItem?.id || !newItem?.price) {
        state.lastError = 'Invalid item: must have id and price';
        console.error(state.lastError);
        return state;
      }

      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );

      const quantityToAdd = Math.max(1, newItem.quantity || 1);

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
        existingItem.totalPrice = parseFloat(
          (existingItem.price * existingItem.quantity).toFixed(2)
        );
      } else {
        state.cartItems.push({
          ...newItem,
          quantity: quantityToAdd,
          totalPrice: parseFloat(
            (newItem.price * quantityToAdd).toFixed(2)
          ),
        });
      }
      state.totalQuantity += quantityToAdd;
      state.lastError = null;
      saveToLocalStorage(state);
    },
    removeCart(state, action) {
      const { itemId } = action.payload || {};
      const existingItem = state.cartItems.find((item) => item.id === itemId);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
        state.lastError = null;
        saveToLocalStorage(state);
      }
    },
    updateQuantity(state, action) {
      const { id, newQuantity } = action.payload || {};
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem && newQuantity >= 0) {
        const quantityDifference = newQuantity - existingItem.quantity;
        existingItem.quantity = newQuantity;
        existingItem.totalPrice = parseFloat(
          (existingItem.price * newQuantity).toFixed(2)
        );
        state.totalQuantity += quantityDifference;
        state.lastError = null;
        saveToLocalStorage(state);
      }
    },
    toggleCart(state) {
      state.showCart = !state.showCart;
      saveToLocalStorage(state);
    },
    clearCart(state) {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.lastError = null;
      saveToLocalStorage(state);
    },
  },
});

const cartMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  console.log('Cart Action:', action.type, 'State:', store.getState().cart);
  return result;
};

export { cartMiddleware };
export const cartActions = cartSlice.actions;
export default cartSlice.reducer;