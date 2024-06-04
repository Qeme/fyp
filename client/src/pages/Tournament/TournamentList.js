import React from 'react'
import { Link } from 'react-router-dom'

const TournamentList = () => {
  return (
    <>
    <div>TournamentList all</div>
    <ul>
        <li><Link to="/tournaments/1">Tournament 1</Link></li>
        <li><Link to="/tournaments/2">Tournament 2</Link></li>
    </ul>
    </>
  )
}

export default TournamentList