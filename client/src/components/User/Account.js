import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import './Account.css'
import AccountData from './AccountData'
import OrderHistory from './OrderHistory'

const Account = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className='Account'>
      <div className='side-bar-container'>
        <div className='side-bar'>
          <div className='item' onClick={() => navigate('/account/accountData')}>
            Datele Contului
          </div>
          <div className='item' onClick={() => navigate('/account/orderHistory')}>
            Istoricul Comenzilor
          </div>
        </div>
      </div>
      <Routes>
        <Route path='accountData' element={<AccountData user={user} />} />
        <Route path='orderHistory' element={<OrderHistory user={user} />} />
      </Routes>
    </div>
  )
}

export default Account