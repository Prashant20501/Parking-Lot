import { Dispatch } from "@reduxjs/toolkit";
import { api } from "../API";
import { setlots } from "../redux/lotsSlice";
import { User } from "../redux/userSlice";

export const fetchLots = (user:User|null,dispatch:Dispatch) => {
  api
    .get("/parkinglot/getlots/")
    .then((res) => {
      const newlots = {
        TW: user?.is_staff ? res.data.TW : res.data.TW == "available" ? 1 : 0,
        FW: user?.is_staff ? res.data.FW : res.data.FW == "available" ? 1 : 0,
      };
      dispatch(setlots(newlots));
    })
    .catch((err) => {
      console.log(err);
    });
};