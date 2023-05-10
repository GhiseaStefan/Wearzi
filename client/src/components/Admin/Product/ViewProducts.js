import './ViewProducts.css'

import { useState } from 'react';

import FilterBar from './FilterBar';
import ViewSingleProduct from './ViewSingleProduct';

const ViewProducts = () => {
  const [products, setProducts] = useState({});

  const SERVER = 'http://localhost:8123';

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
      <FilterBar setProducts={setProducts} />
      <div className='products-container'>
        {Object.values(products).map(p => (
          <ViewSingleProduct key={p._id} p={p} handleDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}

export default ViewProducts