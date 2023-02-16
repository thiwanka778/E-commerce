import { useSelector } from "react-redux";
import {useLocation,Navigate,Outlet} from "react-router-dom";


const RequiredAuth=()=>{
    const location=useLocation();
   const userType=useSelector((state:any)=>state.auth.userType);
    return (
        userType==="admin"
        ?<Outlet/>
        :<Navigate to="/" state={{from:location}} replace />
    )
}

export default RequiredAuth;