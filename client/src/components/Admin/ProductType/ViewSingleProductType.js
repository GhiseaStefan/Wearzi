import { useEffect, useState } from 'react'
import './ViewSingleProductType.css'

const ViewSingleProductType = ({ productType, handleDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [productTypeName, setProductTypeName] = useState(productType.product_type_name);

  const SERVER = 'http://localhost:8123'

  const handleChange = (e) => {
    setProductTypeName(e.target.value);
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${SERVER}/productTypes/${productType._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_type_name: productTypeName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      setEditMode(false);
    } catch (err) {
      console.warn('Failed to update productType:', err);
    }
  };

  return (
    <div className='ViewSingleProductType'>
      <div className='info'>
        <div className='info-item'>
          <p>_id: {productType._id}</p>
        </div>
        {editMode ?
          <div className='info-item-edit'>
            <label>product_type_name:</label>
            <input type='text' value={productTypeName} onChange={handleChange} />
          </div>
          :
          <div className='info-item'>
            <p>product_type_name: {productTypeName}</p>
          </div>
        }
        <div className='info-item'>
          <p>subcategory_id: {productType.subcategory_id}</p>
        </div>
      </div>
      {editMode && <input className='save-item' type='button' value='Salveaza' onClick={handleUpdate} />}
      <button className='delete-item' onClick={() => handleDelete(productType._id)}></button>
      <button className='edit-item' onClick={() => setEditMode(!editMode)}><i className="fa-solid fa-pen-to-square"></i></button>
    </div>
  )
}

export default ViewSingleProductType