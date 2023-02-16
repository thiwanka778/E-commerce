import React from 'react';
import "./stylesf.css";
import {getFoodId} from "../../features/cartSlice/cartSlice";
import {useDispatch,useSelector} from "react-redux";

interface itemsProps{
    item:any,
    createCartItem:Function|any,
}

const UserFoodCard = (props:itemsProps) => {

    const dispatch=useDispatch();
    const cartBtn=useSelector((state:any)=>state.cart.cartBtn);

/*  const cartClick=()=>{
   dispatch(getFoodId(props.item.id));
    props.createCartItem();
}  */

  return (
    <div className='root'>
        <img  className='image' src={props.item.itemUrl} alt=""/>
            <p className='title2'>{props.item.itemName}</p>
            <p className='price2' style={{marginBottom:props.item.itemDes===""?"auto":"0px"}}>Rs. <span>{props.item.itemPrice}</span></p>
           {props.item.itemDes!=="" && <p className='des2' style={{marginBottom:"auto"}}>
           {props.item.itemDes}
            </p>}
           {cartBtn===false && <button className='btn2' onClick={()=>props.createCartItem(props.item.id)} >Add to cart</button>}
           {cartBtn===true &&  <button className='btn2' style={{background:"gray"}}   >Add to cart</button>}
        

        </div>
  )
}

export default UserFoodCard