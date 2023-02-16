import React from 'react'
import FoodCard from '../components/FoodCard/FoodCard';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Button} from 'antd';
import "../styles.css";
import { useSelector ,useDispatch} from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { openHandleClose} from '../features/foodItemSlice/foodItemSlice';
import { Input } from 'antd';
import {storage} from "../firebaseConfig";
import {ref,uploadBytes} from "firebase/storage";
import { nanoid } from '@reduxjs/toolkit';
import { db } from '../firebaseConfig';
import {collection,updateDoc,doc,getDocs,deleteDoc} from "firebase/firestore";
import { somethingChange } from '../features/authSlice/authSlice';
import {getCartItems} from "../features/cartSlice/cartSlice";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { getFoodItems,deleteCloseItem,getFoodIdDeleting } from '../features/foodItemSlice/foodItemSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import DialogTitle from '@mui/material/DialogTitle';
const { TextArea } = Input;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const UpdateItem = () => {
  const dispatch=useDispatch();
  const cartCollection=collection(db,"cart");
  const [loadingb,setLoadingb]=React.useState<boolean>(false);
  const [opend, setOpend] = React.useState<boolean>(false);
  const openDelete=useSelector((state:any)=>state.foodItems.openDelete);
  const [loading,setLoading]=React.useState<boolean>(false);
  const [imageUpload,setImageUpload]=React.useState<any>(null);
  const [imageUrl,setImageUrl]=React.useState<string>("")
  const foodItemId=useSelector((state:any)=>state.foodItems.foodItemId)
  const [valueUD, setValueUD] = React.useState<string | null>(null);
  const foodTypeArray=useSelector((state:any)=>state.foodTypes.foodTypeArray);
  const isChange=useSelector((state:any)=>state.auth.isChange)
  const deleteChange=useSelector((state:any)=>state.foodItems.deleteChange);
 const open=useSelector((state:any)=>state.foodItems.open);
  const foodTypeArrayRedux=useSelector((state:any)=>state.foodTypes.foodTypeArray);
  const foodItemArrayRedux=useSelector((state:any)=>state.foodItems.foodItemsArray);
  const [foodItemsArray,setFoodItemsArray]=React.useState<any>([]);
  const [openUpdate, setOpenUpdate] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string | null>(null);
  const [cart,setCart] =React.useState<any>([]);
const itemsCollection=collection(db,"items");

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

const handleCloseUpdateSnackBar = () => {
  setOpenUpdate(false);
};
const [detail,setDetail]=React.useState<any>({
  name:"",
  price:"",
  des:"",
});

let popFoodDetail={
  name:"",
  price:"",
  des:"",
  photoUrl:"",
};

for(let i=0;i<foodItemArrayRedux.length;i++){
  if(foodItemId===foodItemArrayRedux[i].id){
      popFoodDetail.name=foodItemArrayRedux[i].itemName;
      popFoodDetail.price=foodItemArrayRedux[i].itemPrice;
      popFoodDetail.des=foodItemArrayRedux[i].itemDes;
      popFoodDetail.photoUrl=foodItemArrayRedux[i].itemUrl;
      break;
  }
}
React.useEffect(()=>{
 setImageUrl(popFoodDetail.photoUrl);
},[isChange])

React.useEffect(()=>{
   setDetail((prevState:any)=>{
          return {
            name:popFoodDetail.name,price:popFoodDetail.price,des:popFoodDetail.des
          }
   })
},[isChange])

const uploadImage=async()=>{
  if(imageUpload!==null){
const imageRef=ref(storage,`images/${imageUpload.name+nanoid()}`)
setLoading(true);
await uploadBytes(imageRef,imageUpload)
.then((result:any)=>{
    setImageUrl((prevState:string)=>{
      return `https://firebasestorage.googleapis.com/v0/b/food-app-ff803.appspot.com/o/images%2F${result.metadata.name}?alt=media&token=1ff3fb66-c991-474b-863e-fb46b0e9363e`
  })
  setLoading(false);
   
});
setImageUpload(null);
  }
};
// update item
const updateItemClick=async()=>{
  dispatch(openHandleClose())
  let foodTypeId:string="";
  if(valueUD!==null){
    for(let i=0;i<foodTypeArrayRedux.length;i++){
          if(valueUD===foodTypeArrayRedux[i].foodType){
            foodTypeId=foodTypeArrayRedux[i].id;
            break;
          }
    }
  }
  if(detail.name!=="" && detail.price!=="" && imageUrl!=="" && valueUD!==null){
    const updatedObject={itemName:detail.name,itemPrice:detail.price,
      itemDes:detail.des,itemUrl:imageUrl,itemTypeId:foodTypeId}
      const itemDoc=doc(db,"items",foodItemId);
      setLoadingb(true);
      setOpenUpdate(true)
      await updateDoc(itemDoc,updatedObject);
      dispatch(somethingChange())
      setLoadingb(false)
  }
  setDetail((prevState:any)=>{
      return {
        name:"",
        price:"",
        des:"",
      }
  });

  setValueUD(null);
  setImageUrl("")
  
}
// update item end


const updateBoxHandleChange=(event:any)=>{
   const {name,value}=event.target;
   setDetail((prevState:any)=>{
      return {
        ...prevState,[name]:value
      }
   })
}

React.useEffect(()=>{
  const getItems=async()=>{
  const data=await getDocs(itemsCollection);
  setFoodItemsArray(data.docs.map((doc:any)=>({...doc.data(),id:doc.id})))
  }
  getItems();
},[isChange]);

let displayFoodType:string="";
if(value!==null){
  for(let j=0;j<foodTypeArrayRedux.length;j++){
        if(foodTypeArrayRedux[j].foodType===value){
          displayFoodType=foodTypeArrayRedux[j].id;
          break;
        }
  }
}

React.useEffect(()=>{
  dispatch(getFoodItems({required:foodItemsArray}))
},[isChange,foodItemsArray,dispatch]);

let itemsExist:boolean=false;

  const displayFoodItems=foodItemArrayRedux.map((item:any)=>{
    if(value!==null){
      if(displayFoodType===item.itemTypeId){
           itemsExist=true;
      }
    }else{
      itemsExist=true;
    }
       if(value!==null){
        if(displayFoodType===item.itemTypeId){
          return (
            <FoodCard key={item.id} item={item}/>
          )
        }
       }else{
        return (
          <FoodCard key={item.id} item={item}/>
         )
       }
      
  });


  const handleClose = () => {
    dispatch(openHandleClose())
    setValueUD(null);
    setImageUrl("");
  };
 
  const deleteItemClick=async()=>{
    dispatch(deleteCloseItem());
    const itemDoc=doc(db,"items",foodItemId);
    await deleteDoc(itemDoc);
    dispatch(getFoodIdDeleting());
    setOpend(true);
    dispatch(somethingChange());
  };

  // start
  React.useEffect(()=>{
  const deleteItemsFromCart=async()=>{
       for(let i=0;i<cart.length;i++){
        if(foodItemId===cart[i].foodId){
          const cartDoc=doc(db,"cart",cart[i].id);
          await deleteDoc(cartDoc);
          dispatch(somethingChange());
        }
       }
       dispatch(somethingChange());
  }

  deleteItemsFromCart();

  },[deleteChange])

  //end

  const handleCloseItemDelete = () => {
    dispatch(deleteCloseItem())
  };
  const handleCloseSnackDelete = () => {
    setOpend(false);
  };


  return (
    <>
    <div>

      <div className='update-auto'>
      <Autocomplete
      disablePortal
      onChange={(event: any, newValue: string | null) => {
        setValue(newValue);
      }}
      id="combo-box-demo"
      size="small"
      options={foodTypeArray.map((item:any)=>item.foodType)}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Choose Food Type" />}
    />
      </div>

   {itemsExist? <div className="update-container">
     {displayFoodItems}
      </div>:<p>No items</p>}

      </div>



      <div>
      <Dialog
        open={open}
        onClose={handleClose}>
      
        <DialogContent>

          <div className="xa">
          <Autocomplete
          className='xab'
          onChange={(event: any, newValue: string | null) => {
            setValueUD(newValue);
          }}
      disablePortal
      id="combo-box-demo"
      options={foodTypeArray.map((item:any)=>item.foodType)}
      sx={{ width: 300 }}
      size="small"
      renderInput={(params) => <TextField {...params} label="Choose Food Type" />}
    />
    <div className='xac'>
    <input type="file"  className='xac-input' onChange={(event:any)=>{setImageUpload(event.target.files[0])}} />
   {loading===false &&  <Button className='xac-btn' style={{color:"blue"}} onClick={uploadImage}>Upload</Button>}
   {loading===true && <Button className='xac-btn' style={{color:"blue"}} disabled>Upload</Button>}
    </div>

    <img className='xad-image' src={imageUrl} alt=""/>

    <TextField style={{marginBottom:"10px"}} id="outlined-basic" onChange={updateBoxHandleChange} label="Food Name" 
    name="name" value={detail.name} size="small" variant="outlined" />

    <TextField style={{marginBottom:"10px"}} type="number" id="outlined-basic" onChange={updateBoxHandleChange} label="Food Price"
     size="small" name="price" value={detail.price} variant="outlined" />
    <TextArea  placeholder="Description" name="des"
     value={detail.des} onChange={updateBoxHandleChange}
    style={{ height: 120, width:300, marginBottom: 20 }} />

            </div>
         
        </DialogContent>
        <DialogActions>
      {detail.name!=="" && detail.price!=="" && valueUD!==null && imageUrl!=="" &&  <Button type="primary" style={{background:"green"}} onClick={updateItemClick}>Update</Button>}
      {(detail.name==="" || detail.price===""  || valueUD===null || imageUrl==="") &&  <Button type="primary" style={{background:"green"}} disabled>Update</Button>}
        <Button type="primary" style={{background:"red"}} onClick={handleClose}>Cancel</Button>
          
        </DialogActions>
      </Dialog>
      </div>

      <div>
      <Backdrop
        sx={{ color: 'blue'}}
        open={loading}
      
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      </div>

      <div>
      <Backdrop
        sx={{ color: 'green'}}
        open={loadingb}
      
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      </div>

      <div>
      <Snackbar open={openUpdate} autoHideDuration={3000} onClose={handleCloseUpdateSnackBar}>
        <Alert onClose={handleCloseUpdateSnackBar} severity="success" sx={{ width: '100%' }}>
           Updated Successfully !
        </Alert>
      </Snackbar>
      </div>

      <div>
      <Dialog
        open={openDelete}
        onClose={handleCloseItemDelete}
      >
        <DialogTitle>
          Are You Sure that You want to delete ?
        </DialogTitle>
        <DialogActions>
          <Button onClick={deleteItemClick} style={{color:"white",background:"orange"}}>Yes</Button>
          <Button onClick={handleCloseItemDelete} style={{color:"white",background:"red"}}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      </div>


      <div>
      <Snackbar open={opend} autoHideDuration={3000} onClose={handleCloseSnackDelete}>
        <Alert onClose={handleCloseSnackDelete} severity="success" sx={{ width: '100%',color:"white",background:"orange"}}>
          Item has been deleted successfully !
        </Alert>
      </Snackbar>
      </div>
      </>
  )
}

export default UpdateItem