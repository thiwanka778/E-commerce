import {createSlice} from "@reduxjs/toolkit";
const lc=window.localStorage.getItem("cartItems");

const initialState={
    cartItems:lc?JSON.parse(lc):[],
    foodId:"",
    cartBtn:false,
 }

const cartSlice:any=createSlice({
    name:"cart",
    initialState,
    reducers:{
          getFoodId:(state:any,action:any)=>{
               state.foodId=action.payload;
          },
          getCartItems:(state:any,action:any)=>{
              state.cartItems=action.payload.required;

              window.localStorage.setItem("cartItems",JSON.stringify(state.cartItems))
          },
          cartBtnClick:(state:any,action:any)=>{
              state.cartBtn=action.payload;
          }

    }
})

export const {getFoodId,getCartItems,cartBtnClick} =cartSlice.actions;
export default cartSlice.reducer;