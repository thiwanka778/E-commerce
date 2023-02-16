import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./features/authSlice/authSlice";
import foodTypesReducer from "./features/foodTypeSlice/foodTypeSlice";
import foodItemsReducer from "./features/foodItemSlice/foodItemSlice";
import cartReducer from "./features/cartSlice/cartSlice";
export const store = configureStore({
reducer: {
auth:authReducer,
foodTypes:foodTypesReducer,
foodItems:foodItemsReducer,
cart:cartReducer,
},
});
