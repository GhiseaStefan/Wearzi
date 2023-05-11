import './ViewSubcategories.css'
import { useState, useEffect } from 'react';
import fetchSubcategories from '../../App/generalFunctions/fetchSubcategories';
import ViewSingleSubcategory from './ViewSingleSubcategory';

const ViewSubcategories = () => {
  const SERVER = 'http://localhost:8123';
  const [subcategories, setSubcategories] = useState({});

  useEffect(() => {
    fetchSubcategories().then(s => setSubcategories(s));
  }, []);

  const deleteSubcategory = async (subcategoryId) => {
    try {
      const response = await fetch(`${SERVER}/subcategories/${subcategoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete subcategory');
      }

      return response.json();
    } catch (err) {
      console.warn(err);
    }
  };

  const handleDelete = async (subcategoryId) => {
    try {
      await deleteSubcategory(subcategoryId);
      setSubcategories((prevSubcategories) => {
        const updatedSubcategories = { ...prevSubcategories };
        delete updatedSubcategories[subcategoryId];
        return updatedSubcategories;
      });
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className='ViewSubcategories'>
      {Object.values(subcategories).map(s => (
        <ViewSingleSubcategory key={s._id} subcategory={s} handleDelete={handleDelete} />
      ))}
    </div>
  )
}

export default ViewSubcategories