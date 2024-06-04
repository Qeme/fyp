import React from 'react'
import { useParams } from 'react-router-dom'

const Payment = () => {
    const {id} = useParams()
  return (
    <div>Payment one particular : {id}</div>
  )
}

export default Payment