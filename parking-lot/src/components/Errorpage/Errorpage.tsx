import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useNavigate } from 'react-router-dom';

const Errorpage = () => {
    const {user}=useSelector((state:RootState)=>state.user);
    const navigate=useNavigate();
    useEffect(()=>{
        setTimeout(() => {
            navigate("/");
        }, 1000);
    },[])
  return (
    <div style={{width:"100vw",height:"80vh"}} className='errorpage d-flex align-items-center justify-content-center'>
        <div className='fw-bold d-flex flex-column justify-content-center align-items-start flex-wrap'>
            <h2>Something went wrong!</h2>
            <h4>Error 404</h4>
        </div>
    </div>
  )
}

export default Errorpage