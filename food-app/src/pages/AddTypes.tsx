import React from 'react';
import { Input } from 'antd';
import "../styles.css";
import { Button} from 'antd';
import {db} from "../firebaseConfig";
import {collection,getDocs,addDoc,updateDoc,doc,deleteDoc} from "firebase/firestore";
import { somethingChange } from '../features/authSlice/authSlice';
import {useSelector,useDispatch} from "react-redux";
import { getFoodTypes,updateDialogCloseType,deleteCloseBox } from '../features/foodTypeSlice/foodTypeSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import TypeCard from "../components/TypeCard/TypeCard";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddTypes = () => {
  const deleteOpen=useSelector((state:any)=>state.foodTypes.deleteOpen);
  const updateOpen=useSelector((state:any)=>state.foodTypes.updateOpen);
  const typeId=useSelector((state:any)=>state.foodTypes.typeId);
  const [opens, setOpens] = React.useState<boolean>(false);
  const [opene, setOpene] = React.useState<boolean>(false);
  const foodTypeArrayRedux=useSelector((state:any)=>state.foodTypes.foodTypeArray);
  const dispatch=useDispatch();
  const [isLoading,setIsLoading]=React.useState<boolean>(false);
  const [foodTypeArray,setFoodTypeArray]=React.useState<any>([])
  const isChange=useSelector((state:any)=>state.auth.isChange);
const foodTypesCollection=collection(db,"food_types");
const [foodType,setFoodType] = React.useState<string>("");
const [ut,setUt]=React.useState<string>("");


const updateTypeHandle=(event:any)=>{
   setUt((prevState:string)=>{
      return event.target.value;
   })
}

console.log(typeId);
 const handleFoodType=(event:any)=>{
        setFoodType((prevState:string)=>{
          return event.target.value
        })
 };

// getting food types

React.useEffect(()=>{
    const getFoodTypes=async()=>{
         const data=await getDocs(foodTypesCollection);
         setFoodTypeArray(data.docs.map((doc:any)=>({...doc.data(),id:doc.id})));
    }
    getFoodTypes();
},[isChange,foodTypesCollection]);

React.useEffect(()=>{
   dispatch(getFoodTypes({required:foodTypeArray}))
},[isChange,foodTypeArray,dispatch,foodTypesCollection]);



// add types
 const createFoodTypes=async()=>{
    // check repeat
let repeat=false;
for(let i=0;i<foodTypeArray.length;i++){
  if(foodType.toLowerCase().trim()===foodTypeArray[i].foodType.toLowerCase().trim()){
       repeat=true;
       break;
  }
}
     if(repeat===false){
      if(foodType!==""){
        setIsLoading(true); 
        await addDoc(foodTypesCollection,{foodType:foodType});
        setOpens(true);
        setIsLoading(false); 
        setFoodType("");
        dispatch(somethingChange());
      }
     
     }else{
      setOpene(true);
     }

     setFoodType("")
    
 };
 const handleCloseSuccess = () => {
  setOpens(false);
};
const handleCloseError = () => {
  setOpene(false);
};

React.useEffect(()=>{
  let utType:string="";
  for(let i=0;i<foodTypeArrayRedux.length;i++){
    if(foodTypeArrayRedux[i].id===typeId){
      utType=foodTypeArrayRedux[i].foodType;
      break;
    }
  }
   setUt((prevState:string)=>{
         return utType;
   });

},[isChange])
const updateTypesClick=async()=>{
  dispatch(updateDialogCloseType());
  let repeat:boolean=false;
  for(let i=0;i<foodTypeArrayRedux.length;i++){
      if(foodTypeArrayRedux[i].foodType.toLowerCase().trim()===ut.toLowerCase().trim()){
        repeat=true;
        break;
      }
  }
  if(repeat===false && ut!==""){
    const typesDoc=doc(db,"food_types",typeId)
    const newObject={foodType:ut}
    await updateDoc(typesDoc, newObject);
    repeat=false;
  }
 
repeat=false;
  
   setUt("");

   dispatch(somethingChange());
};


const displayFoodTypes=foodTypeArrayRedux.map((item:any)=>{
         return (
        
          <li><TypeCard key={item.id} item={item} /></li>
         )
});

const handleCloseUpdateType = () => {
  dispatch(updateDialogCloseType())
};

const deleteType=async()=>{
  const typeDoc=doc(db,"food_types",typeId);
  await deleteDoc(typeDoc);
  dispatch(deleteCloseBox());
  dispatch(somethingChange());
}
const handleCloseDeleteDialog = () => {
   dispatch(deleteCloseBox())
};

  return (
    <>
    <div> 
      <section className='add-type-a'>
        <div className='add-type-input'> <Input width="100px" onChange={handleFoodType} 
        value={foodType} placeholder="Add Types" /></div>
       {isLoading===false && <div><Button type="primary"  onClick={createFoodTypes}>+Add</Button></div>}
       { isLoading===true && <div><Button type="primary" disabled>+Add</Button></div>}
      </section>

     {isLoading===false ? <section className='add-type-b'>
        <p className='add-type-title'>{foodTypeArrayRedux.length>0?"Food Types you have added":"Food Types has not been added !"}</p>
        <ol className='add-type-ol'>
        {displayFoodTypes}
        </ol>
      </section>:<p className='add-type-loading'>Loading...</p>}
      </div>

      

      <div>
      <Snackbar open={opens} autoHideDuration={2000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Food type has been added successfully !
        </Alert>
      </Snackbar>
      </div>


      <div>
      <Snackbar open={opene} autoHideDuration={2000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="warning" sx={{ width: '100%' }}>
          Food type already in the database !
        </Alert>
      </Snackbar>
      </div>


      <div>
      <Dialog
        open={updateOpen}
        onClose={handleCloseUpdateType}
      >
        <DialogTitle >
         Update Food Types
        </DialogTitle>
        <DialogContent>
        <TextField onChange={updateTypeHandle} value={ut} label="Food Types" size="small" variant="filled" />
        </DialogContent>
        <DialogActions>
          <Button onClick={updateTypesClick} style={{background:"green",color:"white"}}  size="small">UPDATE</Button>
          <Button size="small" style={{background:"red",color:"white"}}  onClick={handleCloseUpdateType}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
      </div>

      <div>
      <Dialog
        open={deleteOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          Are You Sure that You want to delete it ?
        </DialogTitle>
        <DialogContent>
         
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteType} style={{background:"green",color:"white"}}>Yes</Button>
          <Button onClick={handleCloseDeleteDialog} style={{background:"red",color:"white"}}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      </div>
      </>
  )
}

export default AddTypes