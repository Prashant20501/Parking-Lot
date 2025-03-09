import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ProgressBar from "../ProgressBar";
import { fetchLots } from "../../utils/fetchlots";
import "./LotsCard.css"
import Lotdetails from "../Lotdetails/Lotdetails";
interface Props {
  is_admin: boolean;
}
const LotsCard = ({ is_admin }: Props) => {
  const { lots } = useSelector((state: RootState) => state.lots);
  const {user} = useSelector((state:RootState)=>state.user)
  const [isvistw,setisvistw]=useState(false);
  const [isvisfw,setisvisfw]=useState(false);
  const dispatch = useDispatch();
  let FWpercent=Math.round((lots?.FW||0)*100/12);
  let TWpercent=Math.round((lots?.TW||0)*100/12);
  useEffect(() => {
    fetchLots(user,dispatch);
  }, []);
  const hidepopup=()=>{
    setisvisfw(false);
    setisvistw(false);
  }
  const show1=()=>{
    setisvistw(true);
  }
  const show2=()=>{
    setisvisfw(true);
  }
  return (
    <div style={{ width: "400px" }} className="lotcard background_color m-3 card">
      <h4  className="m-0 bg-secondary p-3 text-center text-light">Available lots</h4>
      <div className="pt-1 card-body">
        <p className="my-3 fs-6 m-0 fw-bold">
          TW slots : &nbsp;
          {is_admin ? lots?.TW : lots?.TW ? "available" : "not:available"}
          {is_admin&&<button type="button" onClick={show1} className="btn btn-outline-secondary p-1 m-2"> Details</button>} 
        </p>
        {isvistw&&<Lotdetails type="TW" hidepopup={hidepopup}/>}
        {is_admin&&<ProgressBar percent={TWpercent}/>}
        {!is_admin&&<ProgressBar percent={lots?.TW?100:0}/>}
        <p className=" my-3 fs-6 m-0 fw-bold">
          FW slots : &nbsp;
          {is_admin ? lots?.FW : lots?.FW ? "available" : "not:available"}
          {is_admin&&<button onClick={show2} type="button" className="btn btn-outline-secondary p-1 m-2"> Details</button>}          
        </p>
        {isvisfw&&<Lotdetails type="FW" hidepopup={hidepopup}/>}
        {is_admin&&<ProgressBar percent={FWpercent}/>}
        {!is_admin&&<ProgressBar percent={lots?.FW?100:0}/>}
        <div className="text-center mt-4">
          <button
            onClick={() => fetchLots(user,dispatch)}
            type="button"
            className="btn my-2 btn-outline-dark"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default LotsCard;
