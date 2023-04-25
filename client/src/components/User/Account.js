import './Account.css'

const Account = ({ user }) => {
  return (
    <div className='Account'>
      <div>
        {user.nume}<br></br>{user.prenume}<br></br>{user.email}
      </div>
    </div>
  )
}

export default Account