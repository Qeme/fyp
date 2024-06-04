import React from 'react'
import { useParams } from 'react-router-dom'

const User = () => {
    const {id} = useParams()
  return (
    <div>User one particular : {id}</div>
  )
}

export default User