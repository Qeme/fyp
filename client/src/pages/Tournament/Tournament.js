import React from 'react'
import { useParams } from 'react-router-dom'

const Tournament = () => {
    const {id} = useParams()
  return (
    <div>Tournament one particular : {id}</div>
  )
}

export default Tournament