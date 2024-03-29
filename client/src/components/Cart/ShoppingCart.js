import { useState } from 'react'

import './ShoppingCart.css'

import totalCantitate from './functions/totalCantitate'
import totalPret from './functions/totalPret'
import discountedPrice from './functions/discountedPrice'
import removeFromCart from './functions/removeFromCart'
import handleSendOrder from './functions/handleSendOrder'

const ShoppingCart = ({ cartItems, setCartItems, loggedIn, user }) => {
  const SERVER = 'http://localhost:8123'
  const [error, setError] = useState('')

  return (
    <div className='ShoppingCart'>
      {totalCantitate(cartItems) !== 0 ?
        <>
          <div className='items-container'>
            <div className='items'>
              <div className='header'>{totalCantitate(cartItems)} {totalCantitate(cartItems) === 1 ? 'produs' : 'produse'}</div>
              {Object.values(cartItems).map(ci => (
                <div className='item' key={ci._id}>
                  <div className='item-image'>
                    <img src={`${SERVER}/images/products/${ci._id}/img1.jpg`} alt='' />
                  </div>
                  <div className='item-info'>
                    {ci.discount === 0 ?
                      <p className='bold'>{ci.price * ci.quantity} RON</p>
                      :
                      <p className='bold'>
                        <span className='discount-text'>{discountedPrice(ci.price, ci.discount) * ci.quantity} RON </span>
                        <span className='not-discount-text'>{ci.price * ci.quantity} RON</span>
                      </p>
                    }
                    <p>{ci.product_name}</p>
                    <p>Culoare: {ci.color}</p>
                    {ci.size[0] !== '' && (<p>Marime: {ci.size.join(', ')}</p>)}
                    <p>Cantitate: {ci.quantity}</p>
                  </div>
                  <button onClick={() => removeFromCart(ci._id, cartItems, setCartItems)}></button>
                </div>
              ))}
            </div>
          </div>
          <div className='info-finalizing'>
            <div className='info-finalizing-container'>
              <p>Pretul Total: {totalPret(cartItems).toFixed(2)} RON</p>
              <p>Livrare: 0 RON</p>
              <p className='bold'>Total cu TVA: {totalPret(cartItems).toFixed(2)} RON</p>
              <div className='btn btn-attention' onClick={() => handleSendOrder(loggedIn, user, cartItems, setCartItems, setError)}>Finalizeaza comanda</div>
              <div className='cupon-container'>
                <input type='text' placeholder='Adauga cupon' />
                <div className='btn'>Adauga</div>
              </div>
              {error && <div className='error'>{error}</div>}
            </div>
          </div>
        </>
        :
        <div className='empty-cart-message'>
          <h1>Cosul dvs. de cumparaturi este gol!</h1>
          <p>Autentificati-va pentru a continua cu salvarea si finalizarea produselor din cosul de cumparaturi.</p>
        </div>
      }
    </div>
  )
}

export default ShoppingCart