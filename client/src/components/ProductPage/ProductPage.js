import { useEffect, useState } from 'react'

import './ProductPage.css'
import MyCarousel from './MyCarousel'
import CustomSelect from './CustomSelect'

const ProductPage = ({ product, cartItems, setCartItems }) => {
  const SERVER = 'http://localhost:8123'
  const [images, setImages] = useState([])
  const [selectedSize, setSelectedSize] = useState('')

  useEffect(() => {
    setImages(loadImages)
  }, [])

  const loadImages = () => {
    const retrievedImages = []
    for (let i = 0; i < product.nrImages; i++) {
      retrievedImages.push(`${SERVER}/images/products/${product._id}/img${i + 1}.jpg`)
    }
    return retrievedImages
  }

  const addToCart = () => {
    const productCart = {
      _id: product._id,
      product_name: product.product_name,
      price: product.price,
      quantity: 1,
      discount: product.discount,
      size: [selectedSize],
      color: product.color,
      description: product.description,
      nrImages: product.nrImages,
      product_type_id: product.product_type_id
    }
    const existingItem = cartItems[productCart._id];
    if (existingItem) {
      const existingSize = existingItem.size.find(s => s === productCart.size[0])
      if (existingSize) {
        setCartItems({ ...cartItems, [productCart._id]: { ...existingItem, quantity: existingItem.quantity + 1 } })
      } else {
        setCartItems({ ...cartItems, [productCart._id]: { ...existingItem, size: [...existingItem.size, productCart.size[0]], quantity: existingItem.quantity + 1 } })
      }
    } else {
      setCartItems({ ...cartItems, [productCart._id]: productCart })
    }
  }

  return (
    <div className='ProductPage'>
      <div className='product-container'>
        <MyCarousel images={images} />
        <div className='util-section'>
          <div className='util-item'>
            <p>{product.product_name}</p>
            <p>
              <span className='bold-text'>
                {product.discount === 0 ?
                  <p>{product.price} RON</p>
                  :
                  <p>
                    <span className='discount-text'>{(product.price - product.price * product.discount).toFixed(2)} RON</span>
                    <span className='not-discount-text'>{product.price} RON</span>
                  </p>
                }
              </span>
            </p>
          </div>
          <div className='util-item'>
            <p><span className='small-gray'>Culoare - {product.color}</span></p>
          </div>
          <div className='util-item'>
            <p><span className='small-gray'>Marime: </span></p>
            <CustomSelect options={product.size} setSelectedResult={setSelectedSize} />
          </div>
          <div className='util-item'>
            <button className='btn' onClick={() => addToCart()}>Adauga in cos</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage