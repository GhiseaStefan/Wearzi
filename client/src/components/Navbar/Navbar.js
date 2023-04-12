import { useEffect, useRef, useState } from 'react'

import './Navbar.css'

import Category from './Category'
import PreviewCart from '../Cart/PreviewCart'
import fetchCategories from '../App/generalFunctions/fetchCategories'
import totalCantitate from '../Cart/functions/totalCantitate'

const Navbar = ({ cartItems }) => {
  const [categories, setCategories] = useState({})
  const isDataLoaded = Object.values(categories).length !== 0;

  const categoryRefs = useRef({})

  useEffect(() => {
    fetchCategories().then(c => setCategories(c))
  }, [])

  return (
    <>
      {isDataLoaded &&
        <div className='Navbar'>
          <a className='logo-link' href='/'>
            <img src='/images/Logo.png' alt='Logo' />
          </a>
          <ul>
            {Object.values(categories).map(c => (
              <Category
                key={c._id}
                category={c}
                categoryRefs={categoryRefs}
              />
            ))}
          </ul>
          <div className='util'>
            <form className='search-form'>
              <input type="search" placeholder='Cauta articole...' />
              <input type="submit" value='' />
            </form>
            <a href='/' className='account-link'>
              <i className="fa-regular fa-user"></i>
            </a>
            <div className='shopping-cart'>
              <a href='/shoppingCart'>
                <i className="fa-solid fa-cart-shopping"></i>
                <div className={`cart-count ${totalCantitate(cartItems) === 0 ? 'cart-empty' : ''}`}>{totalCantitate(cartItems)}</div>
              </a>
              <PreviewCart cartItems={cartItems} />
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Navbar