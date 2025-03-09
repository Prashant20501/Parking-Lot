import React, { useState } from "react";
import "./AssignCard.css";
import { useForm } from "react-hook-form";
import { api } from "../../API";
import PopUp from "../PopUp/PopUp";
interface FormData {
  vehicle_number: string;
  vehicle_type: string;
  level: number;
}
export interface assignedlot {
  vehicle_number:string;
  vehicle_type:string;
  lot:number;
  level: number;
  in_time:string;
  out_time:string;
  fee:number
}
const AssignCard = () => {
  const [isvisible, setisvisible] = useState(false);
  const [error,seterror]=useState("");
  const [assignedlot, setassignedlot] = useState<assignedlot|null>(null);
  const hidepopup = () => {
    setisvisible(false);
    return;
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },reset
  } = useForm<FormData>({
    mode: "onChange",
  });
  const onsubmit = (data: FormData) => {
    const formData = new URLSearchParams(Object.entries(data));
    api
      .post("/parkinglot/assignlot/", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        console.log(response.data);
        setassignedlot({...response.data, in_time:new Date(response.data.in_time).toLocaleString()});
        setisvisible(true);
        reset();
      })
      .catch((error) => {
        console.error("Error:", error.response?.data);
        seterror(error.response?.data.message);
      });
  };
  return (
    <div style={{ width: "400px" }} className=" background_color m-3 assigncard card">
      {isvisible && <PopUp hidepopup={hidepopup} assignedlot={assignedlot} />}
      <h4 className="m-0 bg-primary p-3 text-center text-light">Assign Lot</h4>
      <div className="card-body">
        <form onSubmit={handleSubmit(onsubmit)} action="">
          <div className="m-1">
            <label
              className="p-1 px-2 ms-1 form-label"
              htmlFor="vehicle_number"
            >
              Vehicle number
            </label>
            <input
              {...register("vehicle_number", {
                required: "Vehicle number is required",
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
            <label className="p-1 px-2 ms-1 form-label" htmlFor="vehicle_type">
              Vehicle type
            </label>
            <select
              {...register("vehicle_type", {
                required: "vehicle type is required",
              })}
              className="form-select"
              name="vehicle_type"
              id="vehicle_type"
            >
              <option value="TW">Two Wheeler</option>
              <option value="FW">Four Wheeler</option>
            </select>
            {errors.vehicle_type && <p>{errors.vehicle_type.message}</p>}
          </div>
          <div className="m-1">
            <label className="p-1 px-2 ms-1 form-label" htmlFor="level">
              Level
            </label>
            <input
              {...register("level", { required: "Level of lot is required" })}
              id="level"
              name="level"
              className="form-control"
              type="number"
            />
            {errors.level && <p>{errors.level.message}</p>}
          </div>
          {error&&<p className="text-danger m-0 mt-2 fw-bold text-center">{error}</p>}
          <div className="text-center mt-3">
            <button
              disabled={!isValid}
              type="submit"
              className="btn btn-outline-primary"
            >
              Assign Lot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignCard;
