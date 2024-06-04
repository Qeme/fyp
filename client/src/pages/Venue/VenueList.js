import React from 'react'
import { Link } from 'react-router-dom'

const VenueList = () => {
  return (
    <>
    <div>VenueList all</div>
    <ul>
        <li><Link to="/venues/1">venue 1</Link></li>
        <li><Link to="/venues/2">venue 2</Link></li>
    </ul>
    </>
  )
}

export default VenueList