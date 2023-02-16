import React from 'react';
import Header from './components/Header';
import NewItem from './pages/NewItem';
import "./styles.css";
import {Routes,Route} from "react-router-dom";
import Home from './pages/Home';
import RequiredAuth from './components/RequiredAuth';
import Menu from './pages/Menu';
import About from './pages/About';
import Service from './pages/Service';
import AddTypes from './pages/AddTypes';
import AddItem from './pages/AddItem';
import UpdateItem from './pages/UpdateItem';
import {getScreenWidth} from "./features/authSlice/authSlice";
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import {useSelector,useDispatch} from "react-redux";
import { getCartItems } from './features/cartSlice/cartSlice';
import Cart from './pages/Cart';
import { getFoodTypes } from './features/foodTypeSlice/foodTypeSlice';
import { getFoodItems} from './features/foodItemSlice/foodItemSlice';
import CartAuth from './components/CartAuth';
import Order from './pages/order/Order';
import Code from './pages/Code';




function App() {
  const dispatch=useDispatch();
  const cartCollection=collection(db,"cart");
  const [screenWidth, setScreenWidth] = React.useState<number>(window.innerWidth);
  const isChange=useSelector((state:any)=>state.auth.isChange);
  const [cart,setCart]=React.useState<any>([]);
  const screenWidthRedux=useSelector((state:any)=>state.auth.screenWidth);
  const [foodTypeArray,setFoodTypeArray]=React.useState<any>([]);
  const foodTypesCollection=collection(db,"food_types");
  const itemsCollection=collection(db,"items");
  const [foodItemsArray,setFoodItemsArray]=React.useState<any>([]);
  React.useEffect(() => {
    
    setScreenWidth(window.innerWidth);
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(()=>{
      dispatch(getScreenWidth(screenWidth))
  },[screenWidth])

console.log(screenWidthRedux);

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

React.useEffect(()=>{
  const getFoodTypes=async()=>{
       const data=await getDocs(foodTypesCollection);
       setFoodTypeArray(data.docs.map((doc:any)=>({...doc.data(),id:doc.id})));
  }
  getFoodTypes();
},[isChange]);

React.useEffect(()=>{
 dispatch(getFoodTypes({required:foodTypeArray}))
},[isChange,foodTypeArray,dispatch]);

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

  return (
    <main className='app'>

     <section className='app-a'>
      <Header/>
     </section>

     <section className='body'>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="menu" element={<Menu/>}/>
      <Route path="about-us" element={<About/>}/>
      <Route path="Service" element={<Service/>}/>
      
      <Route element={<CartAuth/>}>
      <Route path="cart" element={<Cart/>}/>
      <Route path="order" element={<Order/>}/>
      </Route>
     

      <Route element={<RequiredAuth/>}>

      <Route path="new-item" element={<NewItem/>}/>
    <Route path="code"  element={<Code/>}/>
      
      </Route>
      </Routes>
    
     </section>

    </main>
  );
}

export default App;
