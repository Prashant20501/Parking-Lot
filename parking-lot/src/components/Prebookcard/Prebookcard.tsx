import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PopUp from "../PopUp/PopUp";
import "./Prebookcard.css";
import { api } from "../../API";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setprebooking } from "../../redux/preebookingSlice";
interface FormData {
  vehicle_type: string;
  level: number;
  in_time: Date;
  out_time: Date;
  vehicle_number: string;
}
const Prebookcard = () => {
  const [isvisible, setisvisible] = useState(false);
  const [error,seterror]=useState("");
  const {prebooking}=useSelector((state:RootState)=>state.prebooking);
  const dispatch=useDispatch();
  const hidepopup = () => {
    setisvisible(false);
    return;
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    getValues
  } = useForm<FormData>({
    mode: "onChange",
  });
  const onsubmit = (data: FormData) => {
    const formData = new URLSearchParams(Object.entries(data));
        api
          .post("/parkinglot/prebooking/", formData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          .then((response) => {
            const {id,user,...restdata}=response.data;
            dispatch(setprebooking({...restdata, in_time:new Date(response.data.in_time).toLocaleString(),out_time:new Date(response.data.out_time).toLocaleString()}));
            setisvisible(true);
            reset();
          })
          .catch((error) => {
            console.error("Error:", error.response?.data);
            seterror(error.response?.data.message);
          });
  };
  return (
    <div style={{ width: "400px" }} className="background_color m-3 prebookcard card">
      {isvisible && <PopUp hidepopup={hidepopup} assignedlot={prebooking} />}
      <h4 className="m-0 bg-primary p-3 text-center text-light">Prebooking Lot</h4>
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
          <div className="m-1">
            <label className="p-1 px-2 ms-1 form-label" htmlFor="in_time">
              In-Time
            </label>
            <input
              {...register("in_time", {
                required: "In time is required",
                validate: (value) => {
                  const in_time = new Date(value);
                  const currentTime = new Date();
                  return (
                    in_time > currentTime || "In time must be valid"
                  );
                },
              })}
              id="in_time"
              name="in_time"
              className="form-control"
              type="datetime-local"
            />
            {errors.in_time && <p>{errors.in_time.message}</p>}
          </div>
          <div className="m-1">
            <label className="p-1 px-2 ms-1 form-label" htmlFor="out_time">
              Out-Time
            </label>
            <input
              {...register("out_time", {
                required: "Out time is required",
                validate: (value) => {
                  const out_time = new Date(value);
                  const in_time = new Date(getValues("in_time"));
                  const currentTime=new Date();
                  return (
                    (out_time > currentTime && out_time>in_time) || "Out time must be valid!"
                  );
                },
              })}
              id="out_time"
              name="out_time"
              className="form-control"
              type="datetime-local"
            />
            {errors.out_time && <p>{errors.out_time.message}</p>}
          </div>
          {error&&<p className="text-danger m-0 mt-2 fw-bold text-center">{error}</p>}
          <div className="text-center mt-3">
            <button
              disabled={!isValid}
              type="submit"
              className="btn btn-outline-primary"
            >
              Prebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Prebookcard;
