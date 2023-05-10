import { useEffect, useState } from "react"

import './ViewSingleProduct.css'

const ViewSingleProduct = ({ p, handleDelete }) => {
  const SERVER = 'http://localhost:8123'

  const [editMode, setEditMode] = useState(false);
  const [productData, setProductData] = useState({});

  useEffect(() => {
    setProductData({
      product_name: p.product_name,
      price: p.price,
      quantity: p.quantity,
      discount: p.discount,
      size: p.size,
      color: p.color,
      description: p.description
    });
    setEditMode(false);
  }, [p]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'size') {
      setProductData({ ...productData, [name]: value.split(',').map(s => s.trim()) });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${SERVER}/products/${p._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      setEditMode(false);
    } catch (err) {
      console.warn('Failed to update product:', err);
    }
  };

  return (
    <div className='ViewSingleProduct'>
      <div className='img-container'>
        <img src={`${SERVER}/images/products/${p._id}/img1.jpg`} alt={p.product_name} />
        <p>_id: {p._id}</p>
      </div>
      <div className='info'>
        <div className='info-item'>
          {editMode ?
            <div className='info-item-edit'>
              <label>product_name: </label>
              <input type='text' name='product_name' value={productData.product_name} onChange={handleChange}/>
            </div> : <div className='info-item-normal'><p>product_name: {productData.product_name}</p></div>
          }
          {editMode ?
            <div className='info-item-edit'>
              <label>price: </label>
              <input type='text' name='price' value={productData.price} onChange={handleChange}/>
            </div> : <div className='info-item-normal'><p>price: {productData.price}</p></div>
          }
          {editMode ?
            <div className='info-item-edit'>
              <label>quantity: </label>
              <input type='text' name='quantity' value={productData.quantity} onChange={handleChange}/>
            </div> : <div className='info-item-normal'><p>quantity: {productData.quantity}</p></div>
          }
          {editMode ?
            <div className='info-item-edit'>
              <label>discount: </label>
              <input type='text' name='discount' value={productData.discount} onChange={handleChange}/>
            </div> : <div className='info-item-normal'><p>discount: {productData.discount}</p></div>
          }
          {editMode ?
            <div className='info-item-edit'>
              <label>size: </label>
              <input type='text' name='size' value={productData.size} onChange={handleChange}/>
            </div> : <div className='info-item-normal'><p>size: {productData.size && productData.size.join(', ')}</p></div>
          }
          {editMode ?
            <div className='info-item-edit'>
              <label>color: </label>
              <input type='text' name='color' value={productData.color} onChange={handleChange}/>
            </div> : <div className='info-item-normal'><p>color: {productData.color}</p></div>
          }
          {editMode ?
            <div className='info-item-edit'>
              <label>description: </label>
              <input type='text' name='description' value={productData.description} onChange={handleChange}/>
            </div> : <div className='info-item-normal'><p>description: {productData.description}</p></div>
          }
        </div>
      </div>
      {editMode && <input className='save-item' type='button' value='Salveaza' onClick={handleUpdate} />}
      <button className='delete-item' onClick={() => handleDelete(p._id)}></button>
      <button className='edit-item' onClick={() => setEditMode(!editMode)}><i className="fa-solid fa-pen-to-square"></i></button>
    </div>
  )
}

export default ViewSingleProduct