import React from 'react'
import { Link } from 'react-router-dom'

const PaymentHistory = () => {
  return (
    <>
    <div>PaymentHistroy all</div>
    <ul>
        <li><Link to="/payments/1">payment 1</Link></li>
        <li><Link to="/payments/2">payment 2</Link></li>
    </ul>
    </>
  )
}

export default PaymentHistory