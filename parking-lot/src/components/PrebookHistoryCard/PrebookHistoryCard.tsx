import "./PrebookHistoryCard.css"
import { assignedlot } from '../AssignCard/AssignCard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useEffect } from "react"
import { api } from "../../API"
import "./PrebookHistoryCard.css"
import { removeprebooking, setprebooking } from "../../redux/preebookingSlice"
const PrebookHistoryCard = () => {
    const {prebooking}=useSelector((state:RootState)=>state.prebooking);
    const dispatch=useDispatch()
    useEffect(()=>{
        api.get("/parkinglot/prebooking/cancel/")
        .then((response)=>{
            if(response.status==200)
                dispatch(setprebooking(response.data));
        })
        .catch((error)=>{
            console.log(error);
        })
    },[])
    const onclick=()=>{
        api.post("/parkinglot/prebooking/cancel/")
        .then((response)=>{
            dispatch(removeprebooking());
        })
        .catch((error)=>{
            console.log(error);
        })
    }
  return (
    <div style={{ width: "400px" }} className="prebookhistory background_color m-3 card">
      <div className="card-body">
        <h4 className="text-center">Active-Prebooking</h4>
        <hr/>
        {prebooking&&
        <ul className="list-group w-100">
           {Object.entries(prebooking).map((entry,index)=>
           <div key={index}>
            <div  className=""><span className="text-danger fw-bold">{entry[0]}</span> : <span>{entry[1]}</span></div>
            <hr/>
            </div>
           )}
        </ul>}
        {!prebooking&&
        <div className="p-4">
            <h3 className="text-danger text-center">No prebooking</h3>
        </div>
        }
        <div className='text-center'>
        <button disabled={prebooking?false:true} className="btn btn-outline-danger" onClick={onclick}>Cancel Prebooking</button>
        </div>
      </div>
    </div>
  )
}

export default PrebookHistoryCard