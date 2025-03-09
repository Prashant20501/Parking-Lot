import React from 'react'
import LotsCard from '../LotsCard/LotsCard'
import Prebookcard from '../Prebookcard/Prebookcard'
import PrebookHistoryCard from '../PrebookHistoryCard/PrebookHistoryCard'

const UserDashboard = () => {
  return (
    <div className="p-4 admindashboard d-flex flex-wrap justify-content-center align-items-start">
      <div className='flex-wrap d-flex flex-column'>
      <LotsCard is_admin={false}/>
      <PrebookHistoryCard/>
      </div>
      <Prebookcard/> 
    </div>
  )
}

export default UserDashboard