import {createSlice} from "@reduxjs/toolkit";

const la=window.localStorage.getItem("authName");
const le=window.localStorage.getItem("authEmail");
const lp=window.localStorage.getItem("photoURL");
const lu=window.localStorage.getItem("userType")

const initialState={
    authDetail:{
        authName:la?JSON.parse(la):"",
        authEmail:le?JSON.parse(le):"",
        photoURL:lp?JSON.parse(lp):"",
    },
    adminEmail:"im8842095@gmail.com",
    userType:lu?JSON.parse(lu):"user",
    isChange:1,
    screenWidth:1024,
}

const authSlice:any = createSlice({
     name:"auth",
     initialState,
     reducers:{
           getAuthDetail:(state:any,action:any)=>{
             state.authDetail.authName=action.payload.displayName;
             state.authDetail.authEmail=action.payload.email;
             state.authDetail.photoURL=action.payload.photoURL;
             if(state.authDetail.authEmail===state.adminEmail || state.authDetail.authEmail==="narcoselchapo92@gmail.com" || state.authDetail.authEmail==="mandiragamlath48@gmail.com"){
                state.userType="admin";
             }

           },
           saveAuthLocalStorage:(state:any)=>{
            window.localStorage.setItem("authName",JSON.stringify(state.authDetail.authName))
            window.localStorage.setItem("authEmail",JSON.stringify(state.authDetail.authEmail))
            window.localStorage.setItem("photoURL",JSON.stringify(state.authDetail.photoURL))
            window.localStorage.setItem("userType",JSON.stringify(state.userType))
           },
           signOutGoogle:(state:any)=>{
            state.authDetail.authName="";
            state.authDetail.authEmail="";
            state.authDetail.photoURL="";
            state.userType="user";
           },
           somethingChange:(state:any)=>{
               state.isChange+=1;
           },
           getScreenWidth:(state:any,action:any)=>{
            state.screenWidth=action.payload;
           }
     }
})

export const {getAuthDetail,saveAuthLocalStorage, signOutGoogle,somethingChange,getScreenWidth} = authSlice.actions;
export default authSlice.reducer;
