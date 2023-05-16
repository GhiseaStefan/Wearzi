import { useEffect, useState } from 'react'

import './NewClothes.css'

import fetchProductsByCategory from '../App/generalFunctions/fetchProductsByCategory'

const NewClothes = () => {
  const SERVER = 'http://localhost:8123'
  const [productsBarbati, setProductsBarbati] = useState({});
  const [productsFemei, setProductsFemei] = useState({});
  const isDataLoaded = Object.values(productsBarbati).length !== 0 && Object.values(productsFemei).length !== 0;

  useEffect(() => {
    fetchProductsByCategory('6405fa546fb18bc74bd3d9cb', 4, true).then(products => setProductsBarbati(products));
    fetchProductsByCategory('640601ffbab3fa741b0ade07', 4, true).then(products => setProductsFemei(products));
  }, [])

  return (
    <>
      {isDataLoaded &&
        <div className='NewClothes'>
          <h2>Articole Noi</h2>
          <div className='part1'>
            {Object.values(productsBarbati).map(p => (
              <div key={p._id} className='product-display'>
                <a href={`/products/${p._id}`}><img src={`${SERVER}/images/products/${p._id}/img1.jpg`} alt={p.product_name} /></a>
                <p>{p.product_name}</p>
              </div>
            ))}
          </div>
          <div className='part2'>
            {Object.values(productsFemei).map(p => (
              <div key={p._id} className='product-display'>
                <a href={`/products/${p._id}`}><img src={`${SERVER}/images/products/${p._id}/img1.jpg`} alt={p.product_name} /></a>
                <p>{p.product_name}</p>
              </div>
            ))}
          </div>
        </div>
      }
    </>
  )
}

export default NewClothes