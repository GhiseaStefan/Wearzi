import { useEffect, useState } from "react"
import './AddProductTemp.css'
import fetchCategories from "../App/generalFunctions/fetchCategories"
import fetchProductTypesByCategory from "../App/generalFunctions/fetchProductTypesByCategory"

const AddProductTemp = () => {
  const SERVER = 'http://localhost:8123'
  const [categories, setCategories] = useState({})
  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false)
  const [productTypes, setProductTypes] = useState({})
  const [isProductTypesLoaded, setIsProductTypesLoaded] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProductType, setSelectedProductType] = useState('')
  const [images, setImages] = useState([])
  const DEFAULT_INPUT_DATA = {
    productName: '',
    price: '',
    quantity: '',
    discount: '',
    size: '',
    color: '',
    description: ' ',
    nrImages: ''
  }
  const [inputData, setInputData] = useState(DEFAULT_INPUT_DATA)

  useEffect(() => {
    fetchCategories(2).then(c => { setCategories(c); setIsCategoriesLoaded(true) })
  }, [])

  useEffect(() => {
    if (isCategoriesLoaded) {
      setSelectedCategory(Object.values(categories)[0]._id)
    }
  }, [categories])

  useEffect(() => {
    if (isCategoriesLoaded) {
      fetchProductTypesByCategory(selectedCategory).then(pt => { setProductTypes(pt); setIsProductTypesLoaded(true) })
    }
  }, [selectedCategory])

  useEffect(() => {
    if (isProductTypesLoaded) {
      setSelectedProductType(Object.values(productTypes)[0]._id)
    }
  }, [productTypes])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setInputData({
      ...inputData,
      [name]: value
    })
  }

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files))
    const { files } = e.target
    setInputData({
      ...inputData,
      ['nrImages']: files.length
    })
  }

  const stringToArray = (str) => {
    return str.split(',').map(v => v.trim())
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    const updatedData = {
      product_name: inputData.productName,
      price: inputData.price,
      quantity: inputData.quantity,
      discount: inputData.discount,
      size: stringToArray(inputData.size),
      color: inputData.color,
      description: inputData.description,
      nrImages: images.length,
      product_type_id: selectedProductType
    };
    setInputData(DEFAULT_INPUT_DATA)
    try {
      const response = await fetch(`${SERVER}/products`, {
        method: 'POST',
        body: JSON.stringify(updatedData),
        headers: { 'Content-Type': 'application/json' }
      })
      const productId = (await response.json())._id
      const formData = new FormData()
      formData.append('_id', productId)
      images.forEach((i) => {
        formData.append('images', i)
      })
      if (!response.ok) {
        throw new Error({ message: 'Failed to create product' })
      }
      try {
        await fetch(`${SERVER}/products/images`, {
          method: 'POST',
          body: formData
        })
        e.target.reset()
        setImages([])
      } catch (err) {
        console.warn(err);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <div className="AddProductTemp">
      <form onSubmit={handleAddProduct}>
        <div className="form-item">
          <label htmlFor="category">Category: </label>
          <select id='category' value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {Object.values(categories).map(c =>
              <option key={c._id} value={c._id}>{c.category_name}</option>
            )}
          </select>
        </div>
        <div className="form-item">
          <label htmlFor="product-type">Product Type: </label>
          <select id='product-type' value={selectedProductType} onChange={(e) => setSelectedProductType(e.target.value)}>
            {selectedCategory &&
              Object.values(productTypes).map(ptype =>
                <option key={ptype._id} value={ptype._id}>{ptype.product_type_name}</option>
              )}
          </select>
        </div>
        <div className="form-item">
          <label>Product name: </label>
          <input type='text' name='productName' value={inputData.productName} onChange={handleInputChange} />
        </div>
        <div className="form-item">
          <label>Price: </label>
          <input type='text' name='price' value={inputData.price} onChange={handleInputChange} />
        </div>
        <div className="form-item">
          <label>Quantity: </label>
          <input type='text' name='quantity' value={inputData.quantity} onChange={handleInputChange} />
        </div>
        <div className="form-item">
          <label>Discount: </label>
          <input type='text' name='discount' value={inputData.discount} onChange={handleInputChange} />
        </div>
        <div className="form-item">
          <label>Size: </label>
          <input type='text' name='size' value={inputData.size} onChange={handleInputChange} />
        </div>
        <div className="form-item">
          <label>Color: </label>
          <input type='text' name='color' value={inputData.color} onChange={handleInputChange} />
        </div>
        <div className="form-item">
          <label>Description: </label>
          <input type='text' name='description' value={inputData.description} onChange={handleInputChange} />
        </div>
        <div className="form-item">
          <label>Images: </label>
          <input type="file" name='images' multiple onChange={handleImageChange} />
        </div>
        <div className="form-item">
          <input type='submit' value='Add product' />
        </div>
      </form>
    </div>
  )
}

export default AddProductTemp