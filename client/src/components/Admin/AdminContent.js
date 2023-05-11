import { Routes, Route } from 'react-router-dom'

import './AdminContent.css'
import ViewProducts from './Product/ViewProducts';
import AddProduct from './Product/AddProduct';
import ViewProductTypes from './ProductType/ViewProductTypes';
import AddProductType from './ProductType/AddProductType';
import ViewSubcategories from './Subcategory/ViewSubcategories';
import AddSubcategory from './Subcategory/AddSubcategory';
import AdminSideBar from './AdminSideBar';
import ViewUsers from './Users/ViewUsers';

const AdminContent = () => {
  return (
    <div className='AdminContent'>
      <AdminSideBar />
      <div className='content'>
        <Routes>
          <Route path='viewProducts' element={<ViewProducts />} />
          <Route path='addProducts' element={<AddProduct />} />
          <Route path='viewProductTypes' element={<ViewProductTypes />} />
          <Route path='addProductTypes' element={<AddProductType />} />
          <Route path='viewSubcategories' element={<ViewSubcategories />} />
          <Route path='addSubcategories' element={<AddSubcategory />} />
          <Route path='viewUsers' element={<ViewUsers />} />
        </Routes>
      </div>
    </div>
  )
}

export default AdminContent