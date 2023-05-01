import { useEffect, useRef, useState } from 'react'

import './Navbar.css'

import Category from './Category'
import PreviewCart from '../Cart/PreviewCart'
import fetchCategories from '../App/generalFunctions/fetchCategories'
import totalCantitate from '../Cart/functions/totalCantitate'
import SearchResults from './SearchResults'
import PreviewAccount from './PreviewAccount'

const Navbar = ({ cartItems, loggedIn, setLoggedIn, user }) => {
  const SERVER = 'http://localhost:8123'
  const [categories, setCategories] = useState({})
  const [searchMessage, setSearchMessage] = useState('')
  const [searchResponse, setSearchResponse] = useState([])
  const isDataLoaded = Object.values(categories).length !== 0;

  const categoryRefs = useRef({})

  useEffect(() => {
    fetchCategories().then(c => setCategories(c))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchMessage) return;

    const response = await fetch(`${SERVER}/advancedSearch`, {
      method: 'POST',
      body: JSON.stringify({ searchMessage }),
      headers: { 'Content-Type': 'application/json' }
    });
    const serverResponse = await response.json()
    setSearchResponse(serverResponse)
    setSearchMessage('')
  }

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
            <li className='Category'>
              <a href='/intelligentSuggestion' className='category-name'>Recomandare Inteligenta</a>
            </li>
          </ul>
          <div className='util'>
            <form className='search-form' onSubmit={handleSubmit}>
              <input type="search" placeholder='Cauta articole...' value={searchMessage} onChange={(e) => setSearchMessage(e.target.value)} />
              <input type="submit" value='' />
            </form>
            <div className='account'>
              <a href='/account' className='account-link'>
                <i className="fa-regular fa-user"></i>
                {loggedIn && <div>{user.prenume}</div>}
              </a>
              <PreviewAccount loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            </div>
            <div className='shopping-cart'>
              <a href='/shoppingCart'>
                <i className="fa-solid fa-cart-shopping"></i>
                <div className={`cart-count ${totalCantitate(cartItems) === 0 ? 'cart-empty' : ''}`}>{totalCantitate(cartItems)}</div>
              </a>
              <PreviewCart cartItems={cartItems} />
            </div>
          </div>
          {searchResponse.length !== 0 && <SearchResults searchResponse={searchResponse} setSearchResponse={setSearchResponse} />}
        </div>
      }
    </>
  )
}

export default Navbar