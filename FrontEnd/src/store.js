import { configureStore } from "@reduxjs/toolkit";
import productsReducer from './slices/ProductsSlice';
import pechinchaReducer from './slices/PechinchaSlice';
import pedidosReducer from "./slices/PedidoSlice";
import reviewsReducer from './slices/ReviewsSlice';
import loginReducer from './slices/LoginSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    pechinchas: pechinchaReducer,
    pedidos: pedidosReducer,
    reviews: reviewsReducer,
    logins: loginReducer
  }
});