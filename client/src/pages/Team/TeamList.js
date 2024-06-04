import React from 'react'
import { Link } from 'react-router-dom'

const TeamList = () => {
  return (
    <>
    <div>TeamList all</div>
    <ul>
        <li><Link to="/teams/1">team 1</Link></li>
        <li><Link to="/teams/2">team 2</Link></li>
    </ul>
    </>
  )
}

export default TeamList