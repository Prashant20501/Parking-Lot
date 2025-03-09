import React from "react";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { api } from "../../API";
import { removeuser } from "../../redux/userSlice";
const Navbar = () => {
  const { login, logout, signup } = useSelector(
    (state: RootState) => state.navbutton
  );
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleclick = () => {
    api
      .get("/user/logout/")
      .then((res) => {
        // console.log(res);
        sessionStorage.removeItem("currentuser");
        dispatch(removeuser());
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const mainclick = () => {
    if (!user) {
      navigate("/");
      return;
    } else {
      navigate("/dashboard");
      return;
    }
  };
  return (
    <nav className="navbar navbar-expand-lg dar" data-bs-theme="primary">
      <div className="text-light container-fluid">
        <a onClick={mainclick} className=" fs-4 fw-bold navbar-brand">
          PARKINGLOT
        </a>
        <button
          className="navbar-toggler fw-bold"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className=" collapse navbar-collapse" id="navbarNav">
          <ul className="text-secondary navbar-nav ms-auto">
            <button
              onClick={() => navigate("signup")}
              disabled={signup}
              className="pe-3 field me-2 d-flex align-items-center"
            >
              <i className="m-1 bi bi-person-fill-add"></i>
              <div>Signup</div>
            </button>
            <button
              onClick={() => navigate("/")}
              disabled={login}
              className="pe-3 field me-2 d-flex align-items-center"
            >
              <i className="bi m-1 bi-box-arrow-in-left"></i>
              <div>LogIn</div>
            </button>
            {user&&
          <button
           style={{backgroundColor:user.is_staff?"rgb(0, 128, 0,0.4)":"rgb(255, 0, 0,0.4)"}} className="p field text-center username me-2 d-flex justify-content-center align-items-center"
            >
              <div className="fw-bold text-dark">{user.username}</div>
            </button>}
            <button
              disabled={logout}
              onClick={() => handleclick()}
              className="pe-3 field d-flex align-items-center"
            >
              <i className="m-1 bi bi-box-arrow-in-right "></i>
              <div>LogOut</div>
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
