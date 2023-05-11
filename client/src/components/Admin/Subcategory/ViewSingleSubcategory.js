import './ViewSingleSubcategory.css'
import { useState } from 'react'

const ViewSingleSubcategory = ({ subcategory, handleDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [subcategoryName, setSubcategoryName] = useState(subcategory.subcategory_name);

  const SERVER = 'http://localhost:8123'

  const handleChange = (e) => {
    setSubcategoryName(e.target.value);
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${SERVER}/subcategories/${subcategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subcategory_name: subcategoryName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      setEditMode(false);
    } catch (err) {
      console.warn('Failed to update subcategory:', err);
    }
  };

  return (
    <div className='ViewSingleSubcategory'>
      <div className='info'>
        <div className='info-item'>
          <p>_id: {subcategory._id}</p>
        </div>
        {editMode ?
          <div className='info-item-edit'>
            <label>subcategory_name:</label>
            <input type='text' value={subcategoryName} onChange={handleChange} />
          </div>
          :
          <div className='info-item'>
            <p>subcategory_name: {subcategoryName}</p>
          </div>
        }
        <div className='info-item'>
          <p>category_id: {subcategory.category_id}</p>
        </div>
      </div>
      {editMode && <input className='save-item' type='button' value='Salveaza' onClick={handleUpdate} />}
      <button className='delete-item' onClick={() => handleDelete(subcategory._id)}></button>
      <button className='edit-item' onClick={() => setEditMode(!editMode)}><i className="fa-solid fa-pen-to-square"></i></button>
    </div>
  )
}

export default ViewSingleSubcategory