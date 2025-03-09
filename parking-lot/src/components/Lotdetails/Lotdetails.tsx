import React, { useEffect, useState } from 'react'
import { api } from '../../API';
import "./Lotdetails.css"
interface Props{
    type:string,
    hidepopup:()=>void
}
interface lot{
    level:number,
    type:string,
    is_available:boolean
}
const Lotdetails = ({type,hidepopup}:Props) => {
  const [lots,setlots]=useState<lot[]>([]);
  useEffect(()=>{
    api.get("/parkinglot/lots")
    .then((res)=>{
        setlots(res.data);
    })
  },[])
  const levelwise:Record<string, any>={};
  const levelwiseavail:Record<string, any>={};
  for(let lot of lots){
    if(lot.type==type)
    {
        if(!levelwiseavail[lot.level])
            levelwiseavail[lot.level]=0;
        if(!levelwise[lot.level])
            levelwise[lot.level]=0;
        levelwiseavail[lot.level]+=lot.is_available?1:0;levelwise[lot.level]+=1;
    }
  };
//   console.log(levelwise);
  return (
    <div className="lot-backdrop">
          <div className="lot position-fixed start-50 translate-middle bg-white p-3 py-2 shadow">
            <button
              className="btn-close position-absolute top-0 end-0 m-3"
              aria-label="Close"
              onClick={()=>hidepopup()}
            ></button>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h4 className="px-4 mb-3">Lot details - {type}</h4>
                {Object.entries(levelwiseavail).map((entry,index)=>{ return(
                        <div key={index}>
                <div className="">
                    <span className="text-danger fw-bold">Level {entry[0]}</span> available lots :&nbsp;
                    <span className="bg-secondary fs-6 text-light rounded num fw-bold px-2">{entry[1]}</span>
                  </div>
                  <hr />
                </div>
                )})
                   }
            </div>
          </div>
        </div>
  )
}

export default Lotdetails