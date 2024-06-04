import React from 'react'
import { useParams } from 'react-router-dom'

const Team = () => {
    const {id} = useParams()
  return (
    <div>Team one particular : {id}</div>
  )
}

export default Team