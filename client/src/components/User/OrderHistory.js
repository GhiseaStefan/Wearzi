import './OrderHistory.css'
import Orders from './Orders'

const OrderHistory = ({ user }) => {

  return (
    <div className='OrderHistory'>
      {user.orders.length !== 0 ?
        <Orders user={user} />
        :
        <div className='empty-orders'>Momentan nu ai realizat nicio comanda</div>
      }
    </div>
  )
}

export default OrderHistory