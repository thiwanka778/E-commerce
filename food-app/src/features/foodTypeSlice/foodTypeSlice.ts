import {createSlice} from "@reduxjs/toolkit";

const localData=window.localStorage.getItem("foodTypesArray");
const initialState={
   foodTypeArray:localData?JSON.parse(localData):[],
   updateOpen:false,
   typeId:"",
   deleteOpen:false,
}

const foodTypeSlice:any = createSlice({
     name:"foodTypes",
     initialState,
     reducers:{
            getFoodTypes:(state:any,action:any)=>{
                state.foodTypeArray=action.payload.required;
                window.localStorage.setItem("foodTypesArray",JSON.stringify(state.foodTypeArray))
            },
          updateOpenDialog:(state:any,action:any)=>{
            state.updateOpen=true;
            state.typeId=action.payload;
          },
          updateDialogCloseType:(state:any,action:any)=>{
            state.updateOpen=false;
          },
          deleteDialogOpen:(state:any,action:any)=>{
              state.deleteOpen=true;
              state.typeId=action.payload;

          },
          deleteCloseBox:(state:any)=>{
            state.deleteOpen=false;
          }
     }
})

export const {getFoodTypes,updateOpenDialog,updateDialogCloseType, deleteDialogOpen,deleteCloseBox}= foodTypeSlice.actions;
export default foodTypeSlice.reducer;