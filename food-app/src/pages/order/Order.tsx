import React from "react";
import "./order.css";
import { Input } from 'antd';
import { Button } from 'antd';
import { useSelector,useDispatch } from "react-redux";
import OrderCard from "../../components/ordercard/OrderCard";
import {db} from "../../firebaseConfig";
import {collection, getDoc, getDocs,addDoc,updateDoc,doc} from "firebase/firestore";
import { somethingChange } from "../../features/authSlice/authSlice";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const Order = () => {
  const dispatch=useDispatch();
  const [loadingp,setLoadingp]=React.useState<boolean>(false);
  const [loading,setLoading]=React.useState<boolean>(false);
  const [loadingu,setLoadingu]=React.useState<boolean>(false);
const isChange=useSelector((state:any)=>state.auth.isChange);
  const screenWidthRedux=useSelector((state:any)=>state.auth.screenWidth);
  const cartItems=useSelector((state:any)=>state.cart.cartItems);
  const authDetail=useSelector((state:any)=>state.auth.authDetail);
  const foodItemsArrayRedux=useSelector((state:any)=>state.foodItems.foodItemsArray);
  const [user,setUser]=React.useState<any>([])
  const [userDetail,setUserDetail]=React.useState<any>({
    name:"",
    address:"",
    contact:"",
    city:"",
    zip:""
  });

const userCollection=collection(db,"users");


  React.useEffect(()=>{
    const getUser=async()=>{
        const data=await getDocs(userCollection);
    setUser(data.docs.map((doc:any)=>({...doc.data(),id:doc.id})))
    }
   getUser();
  },[isChange]);


let userExist:boolean=false;
  for(let k=0;k<user.length;k++){
     if(authDetail.authEmail===user[k].email){
      userExist=true;
        break;
     }
  };


  const createUser=async()=>{
    if(userDetail.name!=="" && userDetail.address!=="" && userDetail.city!=="" && userDetail.contact!=="" && userDetail.zip!=="" && authDetail.authEmail!==""){
      setLoading(true);
      await addDoc(userCollection,
        {name:userDetail.name, address:userDetail.address,contact:userDetail.contact,
        city:userDetail.city,zip:userDetail.zip,email:authDetail.authEmail})
        dispatch(somethingChange())
        setLoading(false);
    }else{

    }
    
  };
  let userId:string="";
  if(user.length>0){
    for(let p=0;p<user.length;p++){
      if(user[p].email===authDetail.authEmail){
          userId=user[p].id;
      }
    }
  }

  const updateUser= async()=>{
    if(userDetail.name!=="" && userDetail.address!=="" && userDetail.city!=="" && userDetail.contact!=="" && userDetail.zip!=="" ){
      setLoadingu(true);
      const userDoc=doc(db,"users",userId)
      const newObject={name:userDetail.name,address:userDetail.address,
     city:userDetail.city,zip:userDetail.zip,contact:userDetail.contact}
    
      await updateDoc(userDoc,newObject);
      dispatch(somethingChange())
      setLoadingu(false);
    }
  }


  const handleUserChange=(event:any)=>{
      const {name,value}=event.target;
      setUserDetail((prevState:any)=>{
          return {
            ...prevState,[name]:value
          }
      })
  }

  const displayCart=cartItems.map((item:any)=>{
    if(authDetail.authEmail===item.email){
      return (
        <OrderCard key={item.id} item={item}/>
      )
    }  
  });

let net:number=0;
for(let i=0;i<cartItems.length;i++){
  for(let j=0;j<foodItemsArrayRedux.length;j++){
     if(authDetail.authEmail===cartItems[i].email){
          if(cartItems[i].foodId===foodItemsArrayRedux[j].id){
              net=net+cartItems[i].quantity*Number(foodItemsArrayRedux[j].itemPrice)
          }
     }
  }
}

React.useEffect(()=>{
  if(userExist===true){
   for(let i=0;i<user.length;i++){
     if(user[i].email===authDetail.authEmail){
       setUserDetail((prevState:any)=>{
           return {
             name:user[i].name,address:user[i].address,city:user[i].city,contact:user[i].contact,zip:user[i].zip
           }
       })
       break;
     }
   }
  }
},[isChange,userExist,user]);

// stripe array start
let stripeArray:any[]=[];
let currentArray:any[]=[];
for(let t=0;t<cartItems.length;t++){
  let  currentObject=cartItems[t];
   if(currentObject.email===authDetail.authEmail){
       currentArray.push(currentObject)
   }
}

for(let i=0;i<currentArray.length;i++){
    for(let j=0;j<foodItemsArrayRedux.length;j++){
        if(currentArray[i].foodId===foodItemsArrayRedux[j].id){
          let cobject={id:foodItemsArrayRedux[j].priceCode,quantity:currentArray[i].quantity}
          stripeArray.push(cobject);
        }
    }
};
console.log(stripeArray)

// stripe array end

const checkout=async()=>{
  setLoadingp(true);
  await fetch("http://localhost:4000/checkout",{
    method: "POST",
    headers: {
      'Content-Type': "application/json"
    },
    body:JSON.stringify({items:stripeArray})
  }).then((response:any)=>{
     return response.json();
   
  }).then((response:any)=>{
    if(response.url){
       window.location.assign(response.url);
        if(response.url==="http://localhost:3000"){
          console.log("success");
        }
    }
  });
  setLoadingp(false);
}
  return (
    <>
         <div className="a">
         {userExist===false &&  <p className="aa">Please add your details ! </p>}

<Input placeholder="Name" name="name" onChange={handleUserChange} value={userDetail.name} style={{marginBottom:"20px",width:"100%"}}/>
<Input placeholder="Address" name="address" onChange={handleUserChange} value={userDetail.address} style={{marginBottom:"20px",width:"100%"}}/>
<Input placeholder="City" name="city" onChange={handleUserChange} value={userDetail.city} style={{marginBottom:"20px",width:"100%"}} />
<Input placeholder="Postal Code" name="zip" onChange={handleUserChange} value={userDetail.zip} style={{marginBottom:"20px",width:"100%"}} />
<Input placeholder="Contact" name="contact" onChange={handleUserChange} value={userDetail.contact} style={{marginBottom:"20px",width:"100%"}} />

{userExist===false &&  <Button onClick={createUser} type="primary" style={{width:"100px"}} >+Add</Button>}
{userExist===true  && <Button onClick={updateUser} type="primary" style={{background:"green",width:"100px"}}>Update</Button> }



<div className="b">
  {displayCart}
</div>

{cartItems.length>0 && <p className="ta">Total Amount : <span>{net}</span></p>}

{userExist===true && <Button onClick={checkout} type="primary" style={{width:"200px",margin:"60px"}} >Purchase Now</Button>}
         </div>


         <div>
         <Backdrop
        sx={{ color: "blue" }}
        open={loading}
       
      >
        <CircularProgress color="inherit" />
      </Backdrop>
         </div>


         <div>
         <Backdrop
        sx={{ color: "green" }}
        open={loadingu}
       
      >
        <CircularProgress color="inherit" />
      </Backdrop>
         </div>


         <div>
         <Backdrop
        sx={{ color: "blue" }}
        open={loadingp}
        
      >
        <CircularProgress color="inherit" />
      </Backdrop>
         </div>
         </>
  );
};

export default Order;
