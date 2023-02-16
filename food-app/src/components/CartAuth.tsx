import { useSelector } from "react-redux";
import {useLocation,Navigate,Outlet} from "react-router-dom";


const CartAuth=()=>{
    const location=useLocation();
   const authDetail=useSelector((state:any)=>state.auth.authDetail);
    return (
        authDetail.authEmail!==""
        ?<Outlet/>
        :<Navigate to="/" state={{from:location}} replace />
    )
}

export default CartAuth;