import React from 'react'
import { useParams } from 'react-router-dom'

const Venue = () => {
    const {id} = useParams()
  return (
    <div>Venue one particular : {id}</div>
  )
}

export default Venue