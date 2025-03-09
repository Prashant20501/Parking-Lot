import React from "react";
import "./PopUp.css";
import { assignedlot } from "../AssignCard/AssignCard";
import { fetchLots } from "../../utils/fetchlots";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
interface Props {
  hidepopup: () => void;
  assignedlot: assignedlot | null;
}
const PopUp = ({ hidepopup, assignedlot }: Props) => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  return (
    <div className="popup-backdrop">
      <div className="popup position-fixed start-50 translate-middle bg-white p-4 py-2 shadow">
        <button
          className="btn-close position-absolute top-0 end-0 m-3"
          aria-label="Close"
          onClick={() => {
            hidepopup();
            fetchLots(user, dispatch);
            return;
          }}
        ></button>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h4 className="px-4 mb-4">Parking Information</h4>
          {assignedlot && (
            <ul className="mx-5 list-group w-100">
              {Object.entries(assignedlot).map((entry, index) => (
                <div key={index}>
                  <div className="">
                    <span className="text-danger fw-bold">{entry[0]}</span> :{" "}
                    <span>{entry[1]}</span>
                  </div>
                  <hr />
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
