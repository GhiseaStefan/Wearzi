import './AddSubcategory.css'
import { useEffect, useState } from 'react';

import fetchCategories from '../../App/generalFunctions/fetchCategories';
import AdminSelect from '../AdminSelect';

const AddSubcategory = () => {
  const [categories, setCategories] = useState({});

  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');

  useEffect(() => {
    fetchCategories().then(c => { setCategories(c); setSelectedCategory(Object.values(c)[0]._id) });
  }, []);

  const handleChange = (e) => {
    setSubcategoryName(e.target.value);
  }

  const handleSubmit = async (e) => {
    const SERVER = 'http://localhost:8123';
    e.preventDefault();
    try {
      const response = await fetch(`${SERVER}/subcategories`, {
        method: 'POST',
        body: JSON.stringify({ subcategory_name: subcategoryName, category_id: selectedCategory }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error({ message: 'Failed to create subcategory' })
      }

      setSubcategoryName('');
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <div className='AddSubcategory'>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className='form-item'>
            <label id='category'>Category:</label>
            <AdminSelect id='category' options={categories} selectedOption={selectedCategory} setSelectedOption={setSelectedCategory} labelKey='category_name' />
          </div>
          <div className='form-item'>
            <label>Subcategory Name:</label>
            <input type='text' value={subcategoryName} onChange={handleChange} />
          </div>
          <div className='form-item'>
            <input type='submit' value='Adauga Subcategorie' />
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSubcategory