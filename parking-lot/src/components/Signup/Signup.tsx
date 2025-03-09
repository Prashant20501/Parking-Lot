import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./Signup.css";
import { useDispatch, useSelector } from "react-redux";
import { togglelogout } from "../../redux/navButtonSlice";
import { api } from "../../API";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
interface FormData {
  username: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
}
const Signup = () => {
  const {user} = useSelector((state:RootState)=>state.user)
  const [error,seterror]=useState("");
  const dispatch = useDispatch();
  useEffect(()=>{
        
      },[])
  useEffect(() => {
    if (user) 
      {navigate("/dashboard");return}
    dispatch(togglelogout(true));
    return () => {
      dispatch(togglelogout(true));
    };
  }, []);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
  });
  const navigate=useNavigate();
  const onsubmit = (data: FormData) => {
    const formData = new URLSearchParams(Object.entries(data));
        api
          .post("/user/signup/", formData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", 
            },    
          })
          .then((res) => {
             console.log(res);
             navigate("/");
          })
          .catch((err) => {
            const er=err.response ? err.response.data : err;
            seterror(er.message); 
          });
  };
  return (
    <div
      className="signupbox d-flex w-100 justify-content-center align-items-start"
    >
      <div className="background_color d-flex flex-column">
        <h1 className="p-3 m-0 bg-secondary text-light text-center">SignUp</h1>
        <hr className="m-0" />
        <form className="m-4" onSubmit={handleSubmit(onsubmit)}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
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
              Password
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
          <div className="mb-3">
            <label htmlFor="confirm_password" className="form-label">
              Confirm Password
            </label>
            <input
              {...register("confirm_password", {
                required: "Confirm password is required!",
                validate: (value) => 
            value === getValues("password") || "Confirm passwords do not match password"
              })}
              type="password"
              className="form-control"
              id="confirm_password"
              name="confirm_password"
            />
            {errors.confirm_password && (
              <p className="text-danger m-0 mt-1 text-center">
                {errors.confirm_password.message}
              </p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">
              First Name
            </label>
            <input
              {...register("first_name", { required: "this is required!" })}
              type="text"
              className="form-control"
              id="first_name"
              name="first_name"
            />
            {errors.first_name && (
              <p className="text-danger m-0 mt-1 text-center">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">
              Last Name
            </label>
            <input
              {...register("last_name", { required: "this is required!" })}
              type="text"
              className="form-control"
              id="last_name"
              name="last_name"
            />
            {errors.last_name && (
              <p className="text-danger m-0 mt-1 text-center">
                {errors.last_name.message}
              </p>
            )}
          </div>
          {error&&<p className="text-danger m-0 fw-bold text-center">{error}</p>}
          <div className="text-center">
            <button
              disabled={isValid ? false : true}
              type="submit"
              className="btn my-3 fs-7 btn-outline-primary"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
