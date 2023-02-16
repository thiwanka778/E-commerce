import React from 'react'
import "../styles.css";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Input } from 'antd';
import { useSelector,useDispatch } from 'react-redux';
import {storage} from  "../firebaseConfig";
import {ref,uploadBytes} from "firebase/storage";
import { nanoid } from '@reduxjs/toolkit';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from 'antd';
import {db} from "../firebaseConfig";
import {collection,getDocs,addDoc} from "firebase/firestore";
import { somethingChange } from '../features/authSlice/authSlice';
import { getFoodItems} from '../features/foodItemSlice/foodItemSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const { TextArea } = Input;


const AddItem = () => {
  const dispatch=useDispatch();
  const [openSnack, setOpenSnack] = React.useState(false);
  const isChange=useSelector((state:any)=>state.auth.isChange)
  const foodTypeArrayRedux=useSelector((state:any)=>state.foodTypes.foodTypeArray);
  const [imageUpload,setImageUpload]=React.useState<any|null>(null);
  const [value, setValue] = React.useState<string | null>(null);
  const [loading,setLoading]=React.useState<boolean>(false);
  const [loadingb,setLoadingb]=React.useState<boolean>(false);
  const [imageUrl,setImageUrl]=React.useState<string>("");
  const itemsCollection=collection(db,"items");
  const [foodItemsArray,setFoodItemsArray]=React.useState<any>([]);

const [itemDetail,setItemDetail]=React.useState<any>({
  name:"",
  price:"",
  des:"",
})

React.useEffect(()=>{
   const getItems=async()=>{
   const data=await getDocs(itemsCollection);
   setFoodItemsArray(data.docs.map((doc:any)=>({...doc.data(),id:doc.id})))
   }
   getItems();
},[isChange]);

React.useEffect(()=>{
   dispatch(getFoodItems({required:foodItemsArray}))
},[isChange,foodItemsArray,dispatch])

const handleChange=(event:any)=>{
 const {name,value}=event.target;
 setItemDetail((prevState:any)=>{
         return {
          ...prevState,[name]:value
         }
 })
};

console.log(itemDetail,value);

const uploadImage=async()=>{
    if(imageUpload!==null){
      const imageRef=ref(storage,`images/${imageUpload.name + nanoid()}`);
      setLoading(true);
     await uploadBytes(imageRef,imageUpload)
     .then((result:any)=>{
             console.log("result name",result.metadata.name);
             setImageUrl((prevState:string)=>{
                 return `https://firebasestorage.googleapis.com/v0/b/food-app-ff803.appspot.com/o/images%2F${result.metadata.name}?alt=media&token=1ff3fb66-c991-474b-863e-fb46b0e9363e`
                 
             })
             setLoading(false);
     })
    }
    setImageUpload(null)
};

const createItem=async()=>{
  let itemType:string="";
  if(value!==null){
    for(let i=0;i<foodTypeArrayRedux.length;i++){
      if(value===foodTypeArrayRedux[i].foodType){
          itemType=foodTypeArrayRedux[i].id;
          break;
      }
    }
  }
   if(itemDetail.name!=="" && itemDetail.price!=="" && value!==null && imageUrl!==""){
    setLoadingb(true);
    setOpenSnack(true);
    await addDoc(itemsCollection,{itemName:itemDetail.name,itemPrice:itemDetail.price,itemDes:itemDetail.des,itemUrl:imageUrl,itemTypeId:itemType})
    
   }
   setItemDetail({name:"",price:"",des:""});
   setImageUrl("");
   setLoadingb(false);
   dispatch(somethingChange());
   setOpenSnack(false);
}


  return (
<>
    <div className='add-item'>
     {imageUrl==="" && <p className='add-item-img-upload-msg'>Please, choose the image and click the upload button</p>}
     <div className='at'>
     <Autocomplete
      disablePortal
      onChange={(event: any, newValue: string | null) => {
        setValue(newValue);
      }}
      id="combo-box-demo"
      size="small"
      options={foodTypeArrayRedux.map((item:any)=>item.foodType)}
      renderInput={(params) => <TextField 
        sx={{ width: 300 }} 
        {...params} variant="filled" label="Choose Food Type" />}
    />
     </div>

     <div>
     <input type="file" className='at-image' onChange={(event:any|null)=>{setImageUpload(event.target.files[0])}}/>
     </div>

     <button onClick={uploadImage} className='upload-btn'>Upload</button>
    
    {imageUrl!=="" && <div className="upload-image"><img className="upload-image-png" src={imageUrl} alt=""/></div>}
     <div className='at-name-text'><Input placeholder="Food Name" value={itemDetail.name}
     onChange={handleChange} name="name"/></div>
     <div className='at-name-text'><Input placeholder="Food Price"
     onChange={handleChange} name="price" value={itemDetail.price}  type="number"/></div>
     <div className="at-des"> 
    <TextArea  placeholder="Description" onChange={handleChange}
    name="des" value={itemDetail.des} style={{ height: 120, width:300, marginBottom: 20 }} />
    </div>
   {itemDetail.name!=="" && itemDetail.price!=="" && imageUrl!=="" && value!==null &&  <div>    <Button onClick={createItem} type="primary">+Add</Button></div>}
  { (itemDetail.name=="" || itemDetail.price=="" || imageUrl=="" || value==null )&&  <div>    <Button type="primary" disabled>+Add</Button></div>}
    </div>



    <div>
    <Backdrop
        sx={{ color: 'blue' }}
        open={loading}
      >
        <CircularProgress color="warning" />
      </Backdrop>
    </div>


    <div>
    <Backdrop
        sx={{ color: 'blue' }}
        open={loadingb}
      >
        <CircularProgress color="success" />
      </Backdrop>
    </div>


    <div>
    <Snackbar open={openSnack} autoHideDuration={2000} >
        <Alert  severity="success" sx={{ width: '100%' }}>
          Item has been added successfully !
        </Alert>
      </Snackbar>
    </div>
    </>
  )
}

export default AddItem