import './AddProductType.css'

import { useEffect, useState } from 'react';

import fetchSubcategories from '../../App/generalFunctions/fetchSubcategories';
import AdminSelect from '../AdminSelect';

const AddProductType = () => {
  const [subcategories, setSubcategories] = useState({});

  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [productTypeName, setProductTypeName] = useState('');

  useEffect(() => {
    fetchSubcategories().then(s => { setSubcategories(s); setSelectedSubcategory(Object.values(s)[0]._id) });
  }, []);

  const handleChange = (e) => {
    setProductTypeName(e.target.value);
  }

  const handleSubmit = async (e) => {
    const SERVER = 'http://localhost:8123';
    e.preventDefault();
    try {
      const response = await fetch(`${SERVER}/productTypes`, {
        method: 'POST',
        body: JSON.stringify({ product_type_name: productTypeName, subcategory_id: selectedSubcategory }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error({ message: 'Failed to create product type' })
      }

      setProductTypeName('');
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <div className='AddProductType'>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className='form-item'>
            <label id='subcategory'>Subcategory:</label>
            <AdminSelect id='subcategory' options={subcategories} selectedOption={selectedSubcategory} setSelectedOption={setSelectedSubcategory} labelKey='subcategory_name' />
          </div>
          <div className='form-item'>
            <label>Product Type Name:</label>
            <input type='text' value={productTypeName} onChange={handleChange} />
          </div>
          <div className='form-item'>
            <input type='submit' value='Adauga Tip de produs' />
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductType