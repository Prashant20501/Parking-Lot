import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { togglelogin, togglelogout, togglesignup } from "../../redux/navButtonSlice";
import { assignedlot } from "../AssignCard/AssignCard";
import { RootState } from "../../redux/store";
import "./HistoryBoard.css";
import axios from "axios";
import { api } from "../../API";
import { useForm } from "react-hook-form";
import { setVehicle } from "../../redux/currentVehicleSlice";
import Sortupdown from "../../Sortupdown";
interface FormData {
  vehicle_number: string;
  lot: number;
  level: number;
}
const HistoryBoard = () => {
  const navigate = useNavigate();
  const {user}=useSelector((state:RootState)=>state.user);
  const dispatch = useDispatch();
  const [parkingdata, setparkingdata] = useState<assignedlot[]>([]);
  const [order,setorder]=useState(true);
  const { current_vehicle } = useSelector(
    (state: RootState) => state.current_vehicle
  );
  const {
    register,
    handleSubmit,
    formState: { errors},
    reset,getValues
  } = useForm<FormData>({ mode: "onChange" })
  const getdata = (params: object) => {
    api
      .get("/parkinglot/parkinghistory/", { params })
      .then((res) => {
        // console.log(res.data, 1111);
        setparkingdata(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleclear = () => {
    dispatch(setVehicle(""));
    reset();
    getdata({});
  };
  useEffect(() => {
    if(!user){
      navigate("/");
      return
    }
    if(user.is_staff==false){
      navigate("/dashboard")
      return
    };
    // console.log(current_vehicle,111);
    if(current_vehicle){
      reset({vehicle_number:current_vehicle});
    }
    if(!current_vehicle){
      reset({vehicle_number:""});
    }
    dispatch(togglelogin(true));
    dispatch(togglesignup(true));
    dispatch(togglelogout(false));
    getdata({ vehicle_number: current_vehicle });
    return () => {
      dispatch(togglelogin(false));
      dispatch(togglesignup(false));
      dispatch(togglelogout(true));
    };
  }, [current_vehicle]);
  const getparams=()=>{
    const params: Record<string, any> = {};
    const values=getValues();
    if (values.vehicle_number) {
      params.vehicle_number = values.vehicle_number;
    }
    if (values.lot) {
      params.lot = values.lot;
    }
    if (values.level) {
      params.level = values.level;
    }
    return params;
  }
  const onsubmit = (data: FormData) => {
    // console.log(data);
    const params=getparams();
    getdata(params);
  };
  const orderfilter=(field:string)=>{
    const params=getparams();
    const orderparams={...params,ordering:order?field:"-"+field};
    setorder(!order);
    getdata(orderparams);
  }
  return (
    <div className="p-3 historyboard d-flex flex-column flex-wrap align-items-center  justify-content-center ">
      <h4 className="fw-bold m-1 w-100 mb-3 text-center">
        Parking Information
      </h4>
      <div
        style={{ width: "80%" }}
        className="d-flex flex-wrap justify-content-center align-items-start"
      >
        <div
          className="mb-2 background_color me-5 formcontainer"
          style={{ width: "auto", height: "auto" }}
        >
          <h5 className="p-3 bg-secondary text-center text-light">
            SEARCH FILTERS
          </h5>
          <form onSubmit={handleSubmit(onsubmit)} className="p-2" action="">
            <div className="m-1">
              <label
                className="p-1 px-2 ms-1 form-label"
                htmlFor="vehicle_number"
              >
                Vehicle number
              </label>
              <input
                {...register("vehicle_number", {
                  required: false,
                  pattern: {
                    value: /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/,
                    message: "Invalid vehicle number format! egMH01AB1234",
                  },
                })}
                id="vehicle_number"
                name="vehicle_number"
                className="form-control"
                type="text"
              />
              {errors.vehicle_number && <p>{errors.vehicle_number.message}</p>}
            </div>
            <div className="m-1">
              <label className="p-1 px-2 ms-1 form-label" htmlFor="level">
                Level
              </label>
              <input
                {...register("level", { required: false })}
                id="level"
                name="level"
                className="form-control"
                type="number"
              />
              {errors.level && <p>{errors.level.message}</p>}
            </div>
            <div className="m-1">
              <label className="p-1 px-2 ms-1 form-label" htmlFor="lot">
                Lot
              </label>
              <input
                {...register("lot", { required: false })}
                id="lot"
                name="lot"
                className="form-control"
                type="number"
              />
              {errors.lot && <p>{errors.lot.message}</p>}
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn me-2 my-3 btn-outline-success"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="me-2 btn btn-outline-primary"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleclear}
                className="btn btn-outline-danger"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
        <div
          style={{ width: "auto" }}
          className="p-0 tablecontainer d-flex flex-column justify-content-start alig-items-center"
        >
          <div style={{ width: "auto" }} className="card mb-2">
            <h5 className="p-3 bg-success text-center text-light">
              ACTIVE PARKING
            </h5>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th onClick={()=>orderfilter("vehicle_number")} scope="col">Vehicle Number<Sortupdown/></th>
                    <th onClick={()=>orderfilter("in_time")} scope="col">In-time<Sortupdown/></th>
                    <th onClick={()=>orderfilter("level")}>Level<Sortupdown/></th>
                    <th onClick={()=>orderfilter("lot")} scope="col">Lot<Sortupdown/></th>
                  </tr>
                </thead>
                <tbody>
                  {parkingdata
                    .filter((data) => !data.out_time)
                    .map((data) => (
                      <tr key={data.vehicle_number}>
                        <th scope="row">{data.vehicle_number}</th>
                        <td>{new Date(data.in_time).toLocaleString()}</td>
                        <td>{data.level}</td>
                        <td>{data.lot}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ width: "auto" }} className="card">
            <h5 className="text-center text-light bg-danger p-3">
              PARKING HISTORY
            </h5>
            <div style={{ width: "auto" }} className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th onClick={()=>orderfilter("vehicle_number")} scope="col">Vehicle Number<Sortupdown/></th>
                    <th onClick={()=>orderfilter("in_time")} scope="col">In-time<Sortupdown/></th>
                    <th onClick={()=>orderfilter("out_time")} scope="col">Out-time<Sortupdown/></th>
                    <th onClick={()=>orderfilter("level")}>Level<Sortupdown/></th>
                    <th onClick={()=>orderfilter("lot")} scope="col">Lot<Sortupdown/></th>
                  </tr>
                </thead>
                <tbody>
                  {parkingdata
                    .filter((data) => data.out_time)
                    .map((data) => (
                      <tr key={data.vehicle_number}>
                        <th scope="row">{data.vehicle_number}</th>
                        <td>{new Date(data.in_time).toLocaleString()}</td>
                        <td>{new Date(data.out_time).toLocaleString()}</td>
                        <td>{data.level}</td>
                        <td>{data.lot}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryBoard;
