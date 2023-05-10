import { Routes, Route, useNavigate } from 'react-router-dom'

import './AdminContent.css'
import ViewProducts from './Product/ViewProducts';
import AddProduct from './Product/AddProduct';
import ViewProductTypes from './ProductType/ViewProductTypes';
import AddProductType from './ProductType/AddProductType';

const AdminContent = () => {
  const navigate = useNavigate();

  return (
    <div className='AdminContent'>
      <div className='side-bar-container'>
        <div className='side-bar'>
          <div className='item'>
            <h2>Produse</h2>
            <div className='subitem'>
              <h3 onClick={() => navigate('/admin/content/viewProducts')}>Vizualizare Produse</h3>
              <h3 onClick={() => navigate('/admin/content/addProducts')}>Adaugare Produse</h3>
            </div>
          </div>
          <div className='item'>
            <h2>Tipuri de produse</h2>
            <div className='subitem'>
              <h3 onClick={() => navigate('/admin/content/viewProductTypes')}>Vizualizare Tipuri de produse</h3>
              <h3 onClick={() => navigate('/admin/content/addProductTypes')}>Adaugare Tipuri de produse</h3>
            </div>
          </div>
          <div className='item'>
            <h2>Subcategorii</h2>
            <div className='subitem'>
              <h3>Vizualizare Subcategorii</h3>
              <h3>Adaugare Subcategorii</h3>
            </div>
          </div>
        </div>
      </div>
      <div className='content'>
        <Routes>
          <Route path='viewProducts' element={<ViewProducts />} />
          <Route path='addProducts' element={<AddProduct />} />
          <Route path='viewProductTypes' element={<ViewProductTypes />} />
          <Route path='addProductTypes' element={<AddProductType />} />
        </Routes>
      </div>
    </div>
  )
}

export default AdminContent