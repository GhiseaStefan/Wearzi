import { useEffect, useState } from 'react';
import './AddProduct.css';
import fetchCategories from '../../App/generalFunctions/fetchCategories';
import fetchProductTypesByCategory from '../../App/generalFunctions/fetchProductTypesByCategory';
import AdminSelect from '../AdminSelect';

const AddProduct = () => {
  const [categories, setCategories] = useState({});
  const [productTypes, setProductTypes] = useState({});

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [data, setData] = useState({
    product_name: '',
    price: '',
    quantity: '',
    discount: '',
    size: [],
    color: '',
    description: ' ',
    images: [],
    nrImages: ''
  });
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    fetchCategories(2).then(c => setCategories(c));
  }, []);

  useEffect(() => {
    if (Object.values(categories).length !== 0) {
      setSelectedCategory(Object.values(categories)[0]._id);
    }
  }, [categories]);

  useEffect(() => {
    if (Object.values(categories).length !== 0) {
      fetchProductTypesByCategory(selectedCategory).then(pt => setProductTypes(pt));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (Object.values(productTypes).length !== 0) {
      setSelectedProductType(Object.values(productTypes)[0]._id);
    }
  }, [productTypes]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'size') {
      setData({ ...data, [name]: value.split(',').map(v => v.trim()) });
    } else if (name === 'images') {
      setData({ ...data, [name]: Array.from(files), nrImages: files.length });
      const imageUrls = Array.from(files).map(file => {
        return URL.createObjectURL(file);
      });
      setImageUrls(imageUrls);
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    const SERVER = 'http://localhost:8123';
    e.preventDefault();
    const firstRequestData = {
      product_name: data.product_name,
      price: data.price,
      quantity: data.quantity,
      discount: data.discount,
      size: data.size,
      color: data.color,
      description: data.description,
      nrImages: data.nrImages,
      product_type_id: selectedProductType
    }
    try {
      const response = await fetch(`${SERVER}/products`, {
        method: 'POST',
        body: JSON.stringify(firstRequestData),
        headers: { 'Content-Type': 'application/json' }
      });
      const productId = (await response.json())._id;

      const formData = new FormData();
      formData.append('_id', productId)
      data.images.forEach((i) => {
        formData.append('images', i)
      });

      if (!response.ok) {
        throw new Error({ message: 'Failed to create product' })
      }

      try {
        await fetch(`${SERVER}/products/images`, {
          method: 'POST',
          body: formData
        });
        e.target.reset();
        setData({
          product_name: '',
          price: '',
          quantity: '',
          discount: '',
          size: [],
          color: '',
          description: ' ',
          images: [],
          nrImages: ''
        });
        setImageUrls([]);
      } catch (err) {
        console.warn(err);
      }

    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <div className='AddProduct'>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className='form-item'>
            <div className='form-item-pair'>
              <div className='pair'>
                <label htmlFor='category'>Category:</label>
                <AdminSelect id='category' options={categories} selectedOption={selectedCategory} setSelectedOption={setSelectedCategory} labelKey='category_name' />
              </div>
              <div>
                <label htmlFor='product_type'>Product Type:</label>
                <AdminSelect id='product_type' options={productTypes} selectedOption={selectedProductType} setSelectedOption={setSelectedProductType} labelKey='product_type_name' />
              </div>
            </div>
          </div>
          <div className='form-item'>
            <div className='form-item-pair'>
              <div className='pair'>
                <label htmlFor=''>Product Name:</label>
                <input type='text' name='product_name' value={data.product_name} onChange={handleChange} />
              </div>
              <div className='pair'>
                <label htmlFor=''>Price</label>
                <input type='text' name='price' value={data.price} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className='form-item'>
            <div className='form-item-pair'>
              <div className='pair'>
                <label htmlFor=''>Quantity</label>
                <input type='text' name='quantity' value={data.quantity} onChange={handleChange} />
              </div>
              <div className='pair'>
                <label htmlFor=''>Discount</label>
                <input type='text' name='discount' value={data.discount} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className='form-item'>
            <div className='form-item-pair'>
              <div className='pair'>
                <label htmlFor=''>Size</label>
                <input type='text' name='size' value={data.size} onChange={handleChange} />
              </div>
              <div className='pair'>
                <label htmlFor=''>Color</label>
                <input type='text' name='color' value={data.color} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className='form-item'>
            <div className='form-item-pair'>
              <div className='pair'>
                <label htmlFor=''>Description</label>
                <input type='text' name='description' value={data.description} onChange={handleChange} />
              </div>
              <div className='pair'>
                <label className='custom-file-upload' htmlFor='images'>Imagini Produs</label>
                <input id='images' type='file' name='images' multiple onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className='form-item'>
            <div className='form-item-pair'>
              <div className='pair'>
                <input type='submit' value='Adauga produs' />
              </div>
              <div className='pair'>
                <div className='preview-images'>
                  <div className='img-container'>
                    {imageUrls?.map((url, index) => (
                      <img key={index} src={url} alt={`Preview ${index}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct