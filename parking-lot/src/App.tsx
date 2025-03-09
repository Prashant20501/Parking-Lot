import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Dashboardholder from "./components/Dashboardholder";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setuser } from "./redux/userSlice";
import HistoryBoard from "./components/HistoryBoard/HistoryBoard";
import "./App.css"
import Errorpage from "./components/Errorpage/Errorpage";
const App = () => {
  const dispatch = useDispatch();
  const [isloading, setisloading] = useState(true);
  useEffect(() => {
    const currentuser = sessionStorage.getItem("currentuser");
    if (currentuser) {
      dispatch(setuser(JSON.parse(currentuser)));
    }
    setisloading(false);
  }, []);
  if (isloading) {
    return (
      <div style={{width:"100vw",height:"100vh"}} className="d-flex justify-content-center align-items-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Login />} errorElement={<Errorpage/>}/>
          <Route path="signup" element={<Signup />} errorElement={<Errorpage/>} />
          <Route path="dashboard" element={<Dashboardholder />} errorElement={<Errorpage/>} />
          <Route path="parkingdata" element={<HistoryBoard />} errorElement={<Errorpage/>} />
          <Route path="*" element={<Errorpage/>}/>
        </Route>
      </>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
