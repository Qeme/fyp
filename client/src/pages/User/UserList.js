import React from 'react'
import { Link } from 'react-router-dom'

const UserList = () => {
  return (
    <>
    <div>UserList all</div>
    <ul>
        <li><Link to="/users/1">user 1</Link></li>
        <li><Link to="/users/2">user 2</Link></li>
    </ul>
    </>
  )
}

export default UserList