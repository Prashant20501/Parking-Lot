import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import AdminDasboard from "./AdminDashboard/AdminDasboard";
import UserDashboard from "./UserDashboard/UserDashboard";
import { togglelogin, togglelogout, togglesignup } from "../redux/navButtonSlice";

const Dashboardholder = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch=useDispatch();
  useEffect(() => {
      dispatch(togglelogin(true));
      dispatch(togglesignup(true));
      dispatch(togglelogout(false));
      return () => {
        dispatch(togglelogin(false));
        dispatch(togglesignup(false));
        dispatch(togglelogout(true));
      };
    }, []);
  useEffect(()=>{
    if (!user) 
      navigate("/")
  },[])
  if (!user) return null;
  if(user.is_staff==true)
    return <AdminDasboard/>;
  else
    return <UserDashboard/>;
};

export default Dashboardholder;
