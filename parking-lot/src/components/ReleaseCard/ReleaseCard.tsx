import React, { useState } from 'react'
import PopUp from '../PopUp/PopUp'
import { assignedlot } from '../AssignCard/AssignCard';
import { useForm } from 'react-hook-form';
import "./ReleaseCard.css"
import { api } from '../../API';
interface FormData {
    vehicle_number: string;
  }
const ReleaseCard = () => {
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
    const onsubmit=(data:FormData)=>{
        const formData = new URLSearchParams(Object.entries(data));
            api
              .post("/parkinglot/releaselot/", formData, {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              })
              .then((response) => {
                // console.log(response);
                setassignedlot({...response.data,fee:Math.round(response.data.fee)+1,in_time:new Date(response.data.in_time).toLocaleString(),out_time:new Date(response.data.out_time).toLocaleString()});
                setisvisible(true);
                reset();
              })
              .catch((error) => {
                console.error("Error:", error.response?.data);
                seterror(error.response?.data.message)
              });
    }
  return (
    <div style={{ width: "400px" }} className=" background_color m-3 releasecard card">
      {isvisible && <PopUp hidepopup={hidepopup} assignedlot={assignedlot} />}
      <h4  className="m-0 bg-danger p-3 text-center text-light">Release Lot</h4>
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
          {error&&<p className="text-danger m-0 mt-2 fw-bold text-center">{error}</p>}
          <div className="text-center mt-3">
            <button
              disabled={!isValid}
              type="submit"
              className="btn btn-outline-danger"
            >
              Release Lot
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReleaseCard