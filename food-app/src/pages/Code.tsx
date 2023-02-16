import React from 'react'
import CordCard from '../components/CordCard/CordCard';
import {useSelector,useDispatch} from "react-redux";
import {db} from "../firebaseConfig";
import {updateDoc,getDocs,doc,collection} from "firebase/firestore";
import { getFoodItems } from '../features/foodItemSlice/foodItemSlice';
import { somethingChange } from '../features/authSlice/authSlice';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import "../styles.css";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Code = () => {
  const dispatch=useDispatch();
  const [loading,setLoading]=React.useState<boolean>(false);
    const foodTypeArrayRedux=useSelector((state:any)=>state.foodTypes.foodTypeArray);
    const foodItemArrayRedux=useSelector((state:any)=>state.foodItems.foodItemsArray);
    const [priceCode,setPriceCode]=React.useState<string>("");
    const isChange=useSelector((state:any)=>state.auth.isChange);
    const itemsCollection=collection(db,"items");
    const [foodItemsArray,setFoodItemsArray]=React.useState<any>([]);
    const [open, setOpen] = React.useState(false);

   
  
    const handleClose = () => {
      setOpen(false);
    };
    React.useEffect(()=>{
      const getItems=async()=>{
      const data=await getDocs(itemsCollection);
      setFoodItemsArray(data.docs.map((doc:any)=>({...doc.data(),id:doc.id})))
      }
      getItems();
   },[isChange]);
   
   React.useEffect(()=>{
      dispatch(getFoodItems({required:foodItemsArray}))
   },[isChange,foodItemsArray,dispatch]);



    const handleChange=(event:any)=>{
      setPriceCode((prevState:string)=>{
           return event.target.value;
      })
  };

  const updateItems=async(id:string,itemName:string,itemPrice:string,itemUrl:string,itemDes:string,itemTypeId:string)=>{
       if(priceCode!==""){
        setLoading(true);
        const itemDoc=doc(db,"items",id);
        const newObject={
              id,itemName,itemPrice,itemDes,itemUrl,itemTypeId,priceCode:priceCode,
            };
            await updateDoc(itemDoc,newObject);
            setOpen(true);
            setLoading(false);
            dispatch(somethingChange())
       }else{
        // empty input
       }
   setPriceCode("");
  }


  console.log(priceCode)
    const cardDisplay=  foodItemArrayRedux.map((item:any)=>{
        return (
            <CordCard key={item.id} item={item} handleChange={handleChange} updateItems={updateItems}/>
        )
    });




  return (
    <>
    <div>
       
{cardDisplay.length>0?<div className='code-container'>
{cardDisplay}
</div>:<p className="code-loading-ab">Loading...</p>}
        </div>


        <div>
        <Backdrop
        sx={{ color:"blue" }}
        open={loading}
        
      >
        <CircularProgress color="inherit" />
      </Backdrop>
        </div>


        <div>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Price Code Added Successfully !
        </Alert>
      </Snackbar>
        </div>
        </>
  )
}

export default Code