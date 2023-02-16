import React from 'react';
import "./orderStyles.css";
import {useSelector} from "react-redux";
interface itemProps{
    item:any,
}

const OrderCard = (props:itemProps) => {
const foodItemsArrayRedux=useSelector((state:any)=>state.foodItems.foodItemsArray);
const authDetail=useSelector((state:any)=>state.auth.authDetail);
let title:string="";
let  price:string="";
let quantity:string="";
let total:number=0;
let itemUrl:string="";

for(let i=0;i<foodItemsArrayRedux.length;i++){
    if(props.item.foodId===foodItemsArrayRedux[i].id){
        title=foodItemsArrayRedux[i].itemName;
        price=foodItemsArrayRedux[i].itemPrice;
        itemUrl=foodItemsArrayRedux[i].itemUrl
        break;
        
    }
}
total=props.item.quantity*Number(price);

  return (
    <div className='root'>
    <img  className='image' src={itemUrl} alt=""/>
        <p className='title2'>{title}</p>
        <p className='price2'>Rs. <span>{price}</span></p>
        <p className="price2">quantity : <span>{props.item.quantity}</span></p>
        <p className="title2">Total : Rs. <span>{total}</span></p>

    </div>
  )
}

export default OrderCard