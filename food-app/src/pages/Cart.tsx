import React from 'react';
import CartItem from '../components/CartItem/CartItem';
import {useSelector,useDispatch} from "react-redux";
import { somethingChange } from '../features/authSlice/authSlice';
import { db } from '../firebaseConfig';
import {collection,getDocs,updateDoc,doc,deleteDoc} from "firebase/firestore";
import {getCartItems} from "../features/cartSlice/cartSlice";
import { useNavigate } from 'react-router-dom';
import "../styles.css";

const Cart = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const cartCollection=collection(db,"cart");
  const isChange=useSelector((state:any)=>state.auth.isChange);
  const [cart,setCart] =React.useState<any>([]);
  const authDetail=useSelector((state:any)=>state.auth.authDetail);
  const cartItems=useSelector((state:any)=>state.cart.cartItems);
  const foodItemArrayRedux=useSelector((state:any)=>state.foodItems.foodItemsArray);

  React.useEffect(()=>{
    const getCartItems=async ()=>{
          const data=await getDocs(cartCollection);
          setCart(data.docs.map((doc:any)=>({...doc.data(),id:doc.id})));
    }
    getCartItems();
  },[isChange]);

  React.useEffect(()=>{
    dispatch(getCartItems({required:cart}))
    
    },[isChange,cart,dispatch]);
 
  const upClick=async(id:string,quantity:number|string)=>{
   const cartDoc=doc(db,"cart",id);
     const  newObject={quantity:Number(quantity)+1}
     await updateDoc(cartDoc,newObject);
     dispatch(somethingChange())
  };

  const downClick=async(id:string,quantity:string|number)=>{
    if(quantity>1){
      const cartDoc=doc(db,"cart",id);
      const  newObject={quantity:Number(quantity)-1}
      await updateDoc(cartDoc,newObject);
    }
    dispatch(somethingChange())
  };

  const deleteCartItem=async(id:string)=>{
      const cartDoc=doc(db,"cart",id);
     await deleteDoc(cartDoc);
     dispatch(somethingChange())
  }

  let varp:string="empty";
const cartDisplay=cartItems.map((item:any)=>{
  if(item.email===authDetail.authEmail){
     varp="no empty";
  }
    if (item.email===authDetail.authEmail && item.foodId!==""){
      return (
        <CartItem key={item.id} item={item}
        deleteCartItem={deleteCartItem}
         upClick={upClick} downClick={downClick}/>
      )
    }
});
let netAmount:number=0;
for(let i=0;i<foodItemArrayRedux.length;i++){
  for(let j=0;j<cartItems.length;j++){
         if( cartItems[j].email===authDetail.authEmail && cartItems[j].foodId===foodItemArrayRedux[i].id){
               netAmount=netAmount+cartItems[j].quantity*Number(foodItemArrayRedux[i].itemPrice)
         }
  }
};


  return (

    <div className='cart'>

{varp==="no empty" ?<div className='cart-display-container'>
       {cartDisplay}
        </div>:<p className='empty'>Your Cart is empty !</p>}

        {netAmount>0 && <p className='net'>Net Amount : Rs. <span>{netAmount}</span></p>}


       {varp==="no empty" &&  <button className="order-button" onClick={()=>navigate("/order")}>Order now</button>}


    </div>
  
  )
}

export default Cart