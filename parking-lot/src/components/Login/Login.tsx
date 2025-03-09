import React, { useEffect, useState } from "react";
import "./Login.css";
import { api } from "../../API";
import { useForm } from "react-hook-form";
import { data, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { togglelogout } from "../../redux/navButtonSlice";
import { RootState } from "../../redux/store"
import { setuser } from "../../redux/userSlice";
interface FormData {
  username: string;
  password: string;
}
const Login = () => {
  const {user} = useSelector((state:RootState)=>state.user)
  const [error,seterror]=useState("");
  const navigate=useNavigate();
  const dispatch = useDispatch();
  useEffect(()=>{
      if (user) 
        navigate("/dashboard")
    },[])
  useEffect(() => {
    dispatch(togglelogout(true));
    return () => {
      dispatch(togglelogout(false));
    };
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
  });
  const onsubmit = (data: FormData) => {
    const formData = new URLSearchParams(Object.entries(data));
    api
      .post("/user/login/", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", 
        },
      })
      .then((res) => {
         console.log(res);
         dispatch(setuser(res.data.user));
         sessionStorage.setItem("currentuser",JSON.stringify(res.data.user));
         navigate("dashboard")
      })
      .catch((err) => {
        console.log(err.response ? err.response.data : err);
        seterror((err.response ? err.response.data : err).message)
      });
  };
  return (
    <div
      style={{ height: "100vh" }}
      className="loginbox  d-flex w-100 justify-content-center align-items-start"
    >
      <div className="background_color d-flex flex-column">
        <h1 className="p-3 m-0 text-center bg-secondary text-light">Login</h1>
        <hr className="m-0" />
        <form className="m-4" onSubmit={handleSubmit(onsubmit)}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username :
            </label>
            <input
              {...register("username", { required: "Username is required!" })}
              type="text"
              className="form-control"
              id="username"
              name="username"
              aria-describedby="emailHelp"
            />
            {errors.username && (
              <p className="text-danger m-0 mt-1 text-center">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password :
            </label>
            <input
              {...register("password", { required: "Password is required!" })}
              type="password"
              className="form-control"
              id="password"
              name="password"
            />
            {errors.password && (
              <p className="text-danger m-0 mt-1 text-center">
                {errors.password.message}
              </p>
            )}
          </div>
          {error&&<p className="text-danger m-0 fw-bold text-center">{error}</p>}
          <div className="text-center">
            <button
              disabled={isValid ? false : true}
              type="submit"
              className="btn my-3 btn-outline-primary"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
