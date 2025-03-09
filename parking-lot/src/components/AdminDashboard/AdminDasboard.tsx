import React from "react";
import "./AdminDashboard.css";
import LotsCard from "../LotsCard/LotsCard";
import AssignCard from "../AssignCard/AssignCard";
import ReleaseCard from "../ReleaseCard/ReleaseCard";
import ParkingHistoryCard from "../Parkinghistory/ParkingHistoryCard";
const AdminDasboard = () => {
  return (
    <div className="p-4 admindashboard d-flex flex-wrap justify-content-center align-items-start">
      <div className="d-flex flex-column flex-wrap">
      <LotsCard is_admin={true}/>
      <ReleaseCard/>
      </div>
      <div>
       <AssignCard/>
       <ParkingHistoryCard/>
      </div>
    </div>
  );
};
export default AdminDasboard;
