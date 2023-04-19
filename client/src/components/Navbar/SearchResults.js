import { useEffect } from 'react';

import './SearchResults.css'

import discountedPrice from '../Cart/functions/discountedPrice'

const SearchResults = ({ searchResponse, setSearchResponse }) => {
  const SERVER = 'http://localhost:8123'

  useEffect(() => {
    if (searchResponse.length !== 0) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [searchResponse]);

  return (
    <div className='SearchResults'>
      <button onClick={() => setSearchResponse([])}></button>
      <div className='items-container'>
        {searchResponse.map(p => (
          <div key={p._id} className='item'>
            <div className='item-image'>
              <a href={`/products/${p._id}`}><img src={`${SERVER}/images/products/${p._id}/img1.jpg`} alt='' /></a>
            </div>
            <div className='item-info'>
              <p>{p.product_name}</p>
              {p.discount === 0 ?
                <p className='bold'>{p.price} RON</p>
                :
                <p className='bold'>
                  <span className='discount-text'>{parseFloat(discountedPrice(p.price, p.discount)).toFixed(2)} RON </span>
                  <span className='not-discount-text'>{p.price} RON</span>
                </p>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResults