import {createSlice} from "@reduxjs/toolkit";

const localData=window.localStorage.getItem("foodItemsArray");
const initialState={
   foodItemsArray:localData?JSON.parse(localData):[],
   foodItemId:"",
   open:false,
   openDelete:false,
   deleteChange:1,
}

const foodItemSlice:any = createSlice({
     name:"foodItems",
     initialState,
     reducers:{
            getFoodItems:(state:any,action:any)=>{
                state.foodItemsArray=action.payload.required;

                window.localStorage.setItem("foodItemsArray",JSON.stringify(state.foodItemsArray))
            },
            getFoodItemId:(state:any,action:any)=>{
                  state.foodItemId=action.payload;
                  state.open=true;
            },
            openHandleClose:(state:any,action:any)=>{
                state.open=false;
            },
            deleteOpenItem:(state:any,action:any)=>{
                state.openDelete=true;
                state.foodItemId=action.payload;
            },
            deleteCloseItem:(state:any)=>{
                state.openDelete=false;
            },
            getFoodIdDeleting:(state:any,action:any)=>{
                   state.deleteChange=state.deleteChange+1;
            }
     }
})

export const {getFoodItems,getFoodItemId, openHandleClose,deleteOpenItem,deleteCloseItem,getFoodIdDeleting}=foodItemSlice.actions;
export default foodItemSlice.reducer;