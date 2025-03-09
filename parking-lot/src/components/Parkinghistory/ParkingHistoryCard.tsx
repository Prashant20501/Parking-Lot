import React, { useRef } from 'react'
import { useDispatch} from 'react-redux'
import { setVehicle } from '../../redux/currentVehicleSlice'
import { useNavigate } from 'react-router-dom'
import "./ParkingHistoryCard.css"
const ParkingHistoryCard = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const ref=useRef<HTMLInputElement>(null);
  const onsubmit=()=>{
    dispatch(setVehicle(ref.current?.value?ref.current?.value:""));
    navigate("/parkingdata")
  }
  return (
    <div style={{ width: "400px" }} className="parkinghistory background_color m-3 releasecard card">
      <h4 className="m-0 bg-success p-3 text-center text-light">Parking-Information</h4>
      <div className="card-body">
          <div className="m-1">
            <label
              className="p-1 px-2 ms-1 form-label"
              htmlFor="vehicle_number"
            >
              Vehicle number
            </label>
            <input
              ref={ref}
              id="vehicle_number"
              name="vehicle_number"
              className="form-control"
              type="text"
            />
          </div>
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={onsubmit}
              className="btn btn-success"
            >
              Get Information
            </button>
          </div>
      </div>
    </div>
  )
}

export default ParkingHistoryCard