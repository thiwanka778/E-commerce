import React from 'react';
import "./styles.css";
import { Button} from 'antd';
import {getFoodItemId,deleteOpenItem} from "../../features/foodItemSlice/foodItemSlice";
import {useSelector,useDispatch} from "react-redux";
import {somethingChange} from "../../features/authSlice/authSlice";



interface propsType{
  item:any,
}
const FoodCard = (props:propsType) => {
  
const dispatch=useDispatch();
const foodTypeArrayRedux=useSelector((state:any)=>state.foodTypes.foodTypeArray);
const foodItemArrayRedux=useSelector((state:any)=>state.foodItems.foodItemsArray);
let itemType:string="";
for(let i=0;i<foodTypeArrayRedux.length;i++){
    if(props.item.itemTypeId===foodTypeArrayRedux[i].id){
         itemType=foodTypeArrayRedux[i].foodType;
        break;
    }
}

const openUpdate=()=>{
  dispatch(getFoodItemId(props.item.id))
  dispatch(somethingChange());
};

const deleteItem=()=>{
  dispatch(deleteOpenItem(props.item.id))
}

  return (
    <>

    <div className="food-card">
      <p className='food-type'>{itemType?itemType:"no type"}</p>
      
      <img className='image' src={props.item.itemUrl} alt=""/>
   
        
        <p className='title'>{props.item.itemName}</p>
        <p className='price' style={{marginBottom:props.item.itemDes!==""?"0px":"auto"}}>Rs. <span>{props.item.itemPrice}</span></p>
       {props.item.itemDes!=="" && <p className='des'>{props.item.itemDes}</p>}

        <div className='btns'>
            <div className='update'>
            <Button type="primary" style={{background:"green"}} onClick={openUpdate}>Update</Button>
            </div>
            <div className='delete'>
            <Button type="primary"  onClick={deleteItem} style={{background:"red"}}>Delete</Button>
            </div>
        </div>
        </div>


      
        </>
  )
}

export default FoodCard