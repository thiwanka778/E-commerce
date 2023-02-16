import React from 'react'
import { Input } from 'antd';
import { Button } from 'antd';
import { somethingChange } from '../../features/authSlice/authSlice';
import {db} from "../../firebaseConfig";
import {collection,getDocs,addDoc} from "firebase/firestore";
import { getFoodItems} from '../../features/foodItemSlice/foodItemSlice';

import "./cordStyles.css";
import { useSelector,useDispatch } from 'react-redux';

interface itemProps{
    item:any,
    handleChange:Function|any,
    updateItems:Function|any,
}
const CordCard = (props:itemProps) => {
    const dispatch=useDispatch();
    const isChange=useSelector((state:any)=>state.auth.isChange);
 
    
  return (
    <div className="root5">
       <img  src={props.item.itemUrl}  alt=""/>
       <p style={{color:props.item?.priceCode?"blue":"red"}} >{props.item?.priceCode?"Added":"Not Added"}</p>
       <p>{props.item.itemName}</p>
       <p>Rs. <span>{props.item.itemPrice}</span></p>
       <Input placeholder="Price Code" onChange={props.handleChange}  style={{marginBottom:"20px",marginTop:"20px"}}/>
        <Button  type="primary" style={{width:"100px"}} onClick={()=>props.updateItems(props.item.id,
            props.item.itemName,props.item.itemPrice,props.item.itemUrl,
            props.item.itemDes,props.item.itemTypeId)}>+Add</Button>
        </div>
  )
}

export default CordCard;