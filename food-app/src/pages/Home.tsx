import React from 'react';
import "../styles.css";
import UserFoodCard from '../components/UserFoodCard/UserFoodCard';
import { useSelector,useDispatch } from 'react-redux';
import { somethingChange } from '../features/authSlice/authSlice';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import {getCartItems,cartBtnClick} from "../features/cartSlice/cartSlice";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Home = () => {
  const dispatch=useDispatch();
  const foodItemsArrayRedux=useSelector((state:any)=>state.foodItems.foodItemsArray);
  const isChange=useSelector((state:any)=>state.auth.isChange);
  const authDetail=useSelector((state:any)=>state.auth.authDetail)
  const foodId=useSelector((state:any)=>state.cart.foodId);
  const [cart,setCart] =React.useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const cartCollection=collection(db,"cart");
  const [openr, setOpenr] = React.useState(false);
  const [opennot, setOpennot] = React.useState<boolean>(false);
  const foodTypeArrayRedux=useSelector((state:any)=>state.foodTypes.foodTypeArray);
  const [value, setValue] = React.useState<string | null>(null);

  
  let nowLength:number=cart.length;

const createCartItem=async(id:string)=>{
 
  let repeat=false;
  for(let i=0;i<cart.length;i++){
    if(cart[i].foodId===id && cart[i].email===authDetail.authEmail){
        repeat=true;
        break;
    }
  };
  if(repeat===false){
    if(authDetail.authEmail!==""){
      nowLength=nowLength+1;
      dispatch(cartBtnClick(true))
      await addDoc(cartCollection,{email:authDetail.authEmail,quantity:1,foodId:id});
      dispatch(somethingChange());
      setOpen(true);
    }else{
       setOpennot(true);
    };
  }else{
    // duplicate data
    setOpenr(true);
  }
 
 
     
};
React.useEffect(()=>{
  const getCartItems=async ()=>{
        const data=await getDocs(cartCollection);
        setCart(data.docs.map((doc:any)=>({...doc.data(),id:doc.id})));
  }
  getCartItems();
},[isChange]);

React.useEffect(()=>{
dispatch(getCartItems({required:cart}));

},[isChange,cart,dispatch]);

let foodTypeId:string="";

if(value!==null){
  for(let i=0;i<foodTypeArrayRedux.length;i++){
    if(value===foodTypeArrayRedux[i].foodType){
     foodTypeId=foodTypeArrayRedux[i].id;
      break;
    }
}
}



const itemsDisplay=foodItemsArrayRedux.map((item:any)=>{
     if(value!==null){
      if(foodTypeId===item.itemTypeId){
        return (<UserFoodCard key={item.id} item={item} createCartItem={createCartItem}/>)
      }
     }else{
      return (
        <UserFoodCard key={item.id} item={item} createCartItem={createCartItem}/>
       )
     }
 
});
const handleClose = () => {
  setOpen(false);
};
const handleCloser = () => {
  setOpenr(false);
};
const handleCloseNot = () => {
  setOpennot(false);
};

React.useEffect(()=>{
  if(cart.length===nowLength){
    dispatch(cartBtnClick(false))
  }
 
},[cart.length]);
  return (
    <>
    <div>

      <div className='home-auto-filter'>
      <Autocomplete
      disablePortal
      onChange={(event: any, newValue: string | null) => {
        setValue(newValue);
      }}
      options={foodTypeArrayRedux.map((item:any)=>item.foodType)}
      id="combo-box-demo"
      size="small"
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Choose food type" />}
    />
      </div>

{itemsDisplay.length>0?<div className='home-container'>
  {itemsDisplay}
</div>:<p className='home-loading'>Loading...</p>}

    </div>


<div>
<Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          The item has been added to the cart successfully !
        </Alert>
      </Snackbar>
</div>

<div>
<Snackbar open={openr} autoHideDuration={3000} onClose={handleCloser}>
        <Alert onClose={handleCloser} severity="info" sx={{ width: '100%' }}>
          The item has been already added !
        </Alert>
      </Snackbar>
</div>

<div>
<Snackbar open={opennot} autoHideDuration={2000} onClose={handleCloseNot}>
        <Alert onClose={handleCloseNot} severity="error" sx={{ width: '100%' }}>
          You should sign in before items are added to the cart !
        </Alert>
      </Snackbar>
</div>
    </>
  )
}

export default Home