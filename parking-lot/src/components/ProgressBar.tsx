interface Props{
    percent:number,
}
const ProgressBar = ({percent}:Props) => {
  let color=percent>70?"success":(percent>40?"warning":"danger");
  return (
    <div
          className="progress text-center my-2"
          role="progressbar"
          aria-label="Danger example"
        >{percent==0&&<span className='text-danger' style={{margin:"auto"}}>Filled out!</span>}
          <div
            className={`progress-bar bg-${color}`}
            style={{width:`${percent}%` }}
          ></div>
        </div>
  )
}

export default ProgressBar