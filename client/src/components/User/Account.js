import './Account.css'
import AccountData from './AccountData'

const Account = ({ user }) => {
  return (
    <div className='Account'>
      <AccountData user={user} />
    </div>
  )
}

export default Account