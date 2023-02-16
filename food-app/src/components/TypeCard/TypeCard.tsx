import React from "react";
import {updateOpenDialog, deleteDialogOpen} from "../../features/foodTypeSlice/foodTypeSlice";
import {useDispatch,useSelector} from "react-redux";
import {somethingChange} from "../../features/authSlice/authSlice";

interface itemProps{
    item:any,
}
const BeautifulComponent = (props:itemProps) => {
  const dispatch=useDispatch();

  const updateClick=()=>{
    dispatch(updateOpenDialog(props.item.id))
    dispatch(somethingChange());
  }
  const deleteClick=()=>{
        dispatch(deleteDialogOpen(props.item.id));
    
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: "10px",
      fontSize: "1rem",
      width:"100%",
      color: "blue",
      justifyContent:"space-between",
      boxShadow:" rgba(0, 0, 0, 0.24) 0px 3px 8px",
      borderRadius:"10px",
      marginBottom:"10px",
      
    }}>
      <p>{props.item.foodType}</p>
      <div>
        <button onClick={updateClick} style={{ cursor: "pointer", marginRight: "1rem", padding: "0.5rem 1rem", backgroundColor: "lightgray", border: "none", borderRadius: "5px" }}>
          Update
        </button>
        <button onClick={deleteClick} style={{ cursor: "pointer", padding: "0.5rem 1rem", backgroundColor: "lightgray", border: "none", borderRadius: "5px" }}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default BeautifulComponent;
