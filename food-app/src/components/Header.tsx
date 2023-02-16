import React from 'react'
import "../styles.css";
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { GoogleAuthProvider,signInWithPopup,signOut } from 'firebase/auth';
import {auth} from "../firebaseConfig";
import { useDispatch ,useSelector} from 'react-redux';
import { getAuthDetail,saveAuthLocalStorage, signOutGoogle } from '../features/authSlice/authSlice';
import {NavLink} from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';


const Header = () => {
  const dispatch=useDispatch();
const authDetail=useSelector((state:any)=>state.auth.authDetail);
const cartItems=useSelector((state:any)=>state.cart.cartItems);
const userType=useSelector((state:any)=>state.auth.userType);
const screenWidthRedux=useSelector((state:any)=>state.auth.screenWidth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [anchorElb, setAnchorElb] = React.useState<null | HTMLElement>(null);
  const openb = Boolean(anchorElb);

  const handleClickAndroid = (event:any) => {
    setAnchorElb(event.currentTarget);
  };
  const handleCloseAndroid = () => {
    setAnchorElb(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const provider = new GoogleAuthProvider();

  const signInWithGoogle=()=>{
      signInWithPopup(auth,provider)
      .then((result:any)=>{
          console.log(result.user);
      dispatch(getAuthDetail({displayName:result.user.displayName,email:result.user.email,photoURL:result.user.photoURL}))
      dispatch(saveAuthLocalStorage())
      }).catch((error:any)=>{
        console.log(error);
      })

      setAnchorEl(null);
  }


  const googleSignOut=()=>{
    signOut(auth).then(() => {
      dispatch( signOutGoogle());
      dispatch(saveAuthLocalStorage());
    }).catch((error) => {
      // An error happened.
    });
    setAnchorEl(null);
  };
let total:number=0;
  for(let i=0;i<cartItems.length;i++){
        if(authDetail.authEmail===cartItems[i].email){
            total=total+Number(cartItems[i].quantity)
        } 
  }

  return (

    <>
    <nav className='header'>
      
      <img className='header-icon' src="https://png.pngtree.com/png-clipart/20221110/original/pngtree-health-restaurant-logo-design-template-vector-picture-image_3607709.png" alt=""/>
      <p className='header-title'>Food</p>
     {screenWidthRedux>700 &&  <NavLink to="/" className='header-p'>Home</NavLink>}
      {screenWidthRedux>700 && <NavLink to="/menu" className='header-p'>Menu</NavLink>}
      {screenWidthRedux>700 && <NavLink to="/about-us" className='header-p'>About Us</NavLink>}
    {screenWidthRedux>700 &&   <NavLink to="/service" className='header-p'>Service</NavLink>}
           {authDetail.authEmail!=="" && <NavLink to="/cart" className="header-p">
            <Badge badgeContent={total} color="success" >
      <ShoppingCartOutlinedIcon color="action" fontSize="large"  />
    </Badge>
            </NavLink>}
    {screenWidthRedux<701 &&   <div className='header-p' >
      <MenuIcon
       id="basic-button"
       aria-controls={openb ? 'basic-menu' : undefined}
       aria-haspopup="true"
       aria-expanded={openb ? 'true' : undefined}
       onClick={handleClickAndroid}
      />
      <Menu
      
        id="basic-menu"
        anchorEl={anchorElb}
        open={openb}
        onClose={handleCloseAndroid}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleCloseAndroid}><NavLink to="/" className='header-p'>Home</NavLink></MenuItem>
        <MenuItem onClick={handleCloseAndroid}>  <NavLink to="/menu" className='header-p'>Menu</NavLink></MenuItem>
        <MenuItem onClick={handleCloseAndroid}><NavLink to="/about-us" className='header-p'>About Us</NavLink></MenuItem>
        <MenuItem onClick={handleCloseAndroid}>  <NavLink to="/service" className='header-p'>Service</NavLink></MenuItem>
      </Menu>
    </div>}

      <div className='header-avatar'  >
      <Avatar alt={authDetail.authName} src={authDetail.photoURL} onClick={handleClick} />
      </div>

    </nav>

    <div className="header-avatar-prop">
      <Menu
        sx={{
          marginTop:"7px",
          
        }}
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
          
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
       {authDetail.authName!=="" && <MenuItem onClick={handleClose}>{authDetail.authName}</MenuItem>}
       {authDetail.authName!=="" &&  <Divider/>}
      {userType==="admin" &&<NavLink to="/new-item" className='nav-link-style'>  <MenuItem onClick={handleClose}>+ New Items</MenuItem></NavLink>}
      {userType==="admin" && <NavLink to="/code" className='nav-link-style'> <MenuItem onClick={handleClose}>+ Code</MenuItem></NavLink>}
       {authDetail.authEmail==="" &&  <MenuItem onClick={signInWithGoogle}>Sign In with Google</MenuItem>}
       {authDetail.authEmail!=="" && <MenuItem onClick={googleSignOut}>Sign Out</MenuItem>}
      </Menu>
      </div>
    </>
  )
}

export default Header