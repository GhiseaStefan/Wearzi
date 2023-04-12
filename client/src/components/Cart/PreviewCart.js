import './PreviewCart.css'

import totalCantitate from './functions/totalCantitate'
import totalPret from './functions/totalPret'
import discountedPrice from './functions/discountedPrice'

const PreviewCart = ({ cartItems }) => {
  const SERVER = 'http://localhost:8123'

  return (
    <div className={`PreviewCart ${totalCantitate(cartItems) !== 0 ? '' : 'preview-cart-empty'}`}>
      <div className='header'>{totalCantitate(cartItems)} produse</div>
      <div className='mini-items'>
        {Object.values(cartItems).map(ci => (
          <div key={ci._id} className='item'>
            <div className='item-image'>
              <img src={`${SERVER}/images/products/${ci._id}/img1.jpg`} alt='' />
            </div>
            <div className='item-info'>
              <p>{ci.product_name}</p>
              <p>{ci.color} - {ci.size.join(', ')}</p>
              <p>Cantitate: {ci.quantity}</p>
              {ci.discount === 0 ?
                <p className='bold'>{ci.price * ci.quantity} RON</p>
                :
                <p className='bold'>
                  <span className='discount-text'>{discountedPrice(ci.price, ci.discount) * ci.quantity} RON </span>
                  <span className='not-discount-text'>{ci.price * ci.quantity} RON</span>
                </p>
              }
            </div>
          </div>
        ))}
      </div>
      <div className='price'>Total: {totalPret(cartItems).toFixed(2)} RON</div>
      <a href='/shoppingCart'>
        <div className='btn'>Vezi Cosul</div>
      </a>
    </div>
  )
}

export default PreviewCart