import React, { useEffect, useState } from 'react';
import fetchCategories from '../../App/generalFunctions/fetchCategories';
import fetchSubcategoriesByCategory from '../../App/generalFunctions/fetchSubcategoriesByCategory';
import fetchProductTypesBySubcategory from '../../App/generalFunctions/fetchProductTypesBySubcategory';
import fetchProductsByProductType from '../../App/generalFunctions/fetchProductsByProductType';
import AdminSelect from '../AdminSelect';
import './FilterBar.css'

const FilterBar = ({ setProducts }) => {
  const [categories, setCategories] = useState({});
  const [subcategories, setSubcategories] = useState({});
  const [productTypes, setProductTypes] = useState({});

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');

  useEffect(() => {
    fetchCategories().then(c => { setCategories(c); setSelectedCategory(Object.values(c)[0]._id) });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategoriesByCategory(selectedCategory).then(s => { setSubcategories(s); setSelectedSubcategory(Object.values(s)[0]._id) });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubcategory) {
      fetchProductTypesBySubcategory(selectedSubcategory).then(pt => { setProductTypes(pt); setSelectedProductType(Object.values(pt)[0]._id) });
    }
  }, [selectedSubcategory]);

  useEffect(() => {
    if (selectedProductType) {
      fetchProductsByProductType(selectedProductType).then(p => setProducts(p));
    }
  }, [selectedProductType]);


  return (
    <div className='FilterBar'>
      <div className='form-container'>
        <form>
          <div className='form-item'>
            <label htmlFor='category'>Category: </label>
            <AdminSelect id='category' options={categories} selectedOption={selectedCategory} setSelectedOption={setSelectedCategory} labelKey='category_name' />
          </div>
          <div className='form-item'>
            <label htmlFor=''>Subcategory:</label>
            <AdminSelect options={subcategories} selectedOption={selectedSubcategory} setSelectedOption={setSelectedSubcategory} labelKey='subcategory_name' />
          </div>
          <div className='form-item'>
            <label htmlFor=''>Product Type:</label>
            <AdminSelect options={productTypes} selectedOption={selectedProductType} setSelectedOption={setSelectedProductType} labelKey='product_type_name' />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterBar