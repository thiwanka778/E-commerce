import React from 'react'
import "./stylesc.css";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useSelector} from "react-redux";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

interface itemProps{
  item:any,
  upClick:Function|any,
  downClick:Function|any,
  deleteCartItem:Function|any,
}
const CartItem = (props:itemProps) => {
  let title:string="";
  let price:string="";
  let des:string="";
  let url:string="";

  const foodItemArrayRedux=useSelector((state:any)=>state.foodItems.foodItemsArray);
  for(let i=0;i<foodItemArrayRedux.length;i++){
     if(props.item.foodId===foodItemArrayRedux[i].id){
      title=foodItemArrayRedux[i].itemName;
      price=foodItemArrayRedux[i].itemPrice;
      des=foodItemArrayRedux[i].itemDes;
      url=foodItemArrayRedux[i].itemUrl;
      break;
     }
  }

  return (
    <div className='root3'>
        <div className='imgd'>
            <img className='img' src={url} alt=""/>
        </div>

        <div className='div2'>
            <p className='title3'>{title}</p>
            <p className='price3'>Rs. <span>{price}</span></p>
            {des!=="" && <p className='des3' >{des}
                </p>}
                <p className='total' >Total : <span>{props.item.quantity*Number(price)}</span></p>
               
                        </div>

                        <div className='partc'>
                       
                        <RemoveIcon style={{cursor:"pointer"}} className="minus" onClick={()=>props.downClick(props.item.id,props.item.quantity)}/>
                        <p className='pm-quantity'>{props.item.quantity}</p>
                        <AddIcon style={{cursor:"pointer"}} className="plus" onClick={()=>props.upClick(props.item.id,props.item.quantity)} />
                        </div>

                        <button className="remove-button" onClick={()=>props.deleteCartItem(props.item.id)}>Remove</button>


        </div>
  )
}

export default CartItem