import './ViewProductTypes.css'
import fetchProductTypes from '../../App/generalFunctions/fetchProductTypes';
import { useEffect, useState } from 'react';
import ViewSingleProductType from './ViewSingleProductType';

const ViewProductTypes = () => {
  const SERVER = 'http://localhost:8123'
  const [productTypes, setProductTypes] = useState({});

  useEffect(() => {
    fetchProductTypes().then(pt => setProductTypes(pt));
  }, []);

  const deleteProductType = async (productTypeId) => {
    try {
      const response = await fetch(`${SERVER}/productTypes/${productTypeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product type');
      }

      return response.json();
    } catch (err) {
      console.warn(err);
    }
  };

  const handleDelete = async (productTypeId) => {
    try {
      await deleteProductType(productTypeId);
      setProductTypes((prevProductTypes) => {
        const updatedProductTypes = { ...prevProductTypes };
        delete updatedProductTypes[productTypeId];
        return updatedProductTypes;
      });
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className='ViewProductTypes'>
      {Object.values(productTypes).map(pt => (
        <ViewSingleProductType key={pt._id} productType={pt} handleDelete={handleDelete} />
      ))}
    </div>
  )
}

export default ViewProductTypes