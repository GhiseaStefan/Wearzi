import './ViewProducts.css'

import { useState, useEffect } from 'react';

import fetchProducts from '../../App/generalFunctions/fetchProducts';

const ViewProducts = () => {
  const [products, setProducts] = useState({});

  const SERVER = 'http://localhost:8123';
  const isDataLoaded = Object.values(products).length !== 0;

  useEffect(() => {
    fetchProducts().then(p => setProducts(p));
  }, []);

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${SERVER}/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      return response.json();
    } catch (err) {
      console.warn(err);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts((prevProducts) => {
        const updatedProducts = { ...prevProducts };
        delete updatedProducts[productId];
        return updatedProducts;
      });
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className='ViewProducts'>
      {isDataLoaded &&
        <div className='products-container'>
          {Object.values(products).map(p => (
            <div className='product'>
              <div className='img-container'>
                <img src={`${SERVER}/images/products/${p._id}/img1.jpg`} alt={p.product_name} />
              </div>
              <div className='info'>
                <div className='info-1'>
                  <p>_id: {p._id}</p>
                  <p>product_name: {p.product_name}</p>
                  <p>price: {p.price}</p>
                  <p>quantity: {p.quantity}</p>
                </div>
                <div className='info-2'>
                  <p>discount: {p.discount}</p>
                  <p>size: {p.size.join(', ')}</p>
                  <p>color: {p.color}</p>
                  <p>description: {p.description}</p>
                </div>
              </div>
              <button className='delete-item' onClick={() => handleDelete(p._id)}></button>
              <button className='edit-item'><i class="fa-solid fa-pen-to-square"></i></button>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default ViewProducts