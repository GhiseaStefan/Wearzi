import './CategoryPage.css'

const CategoryPage = ({ category, subcategory1, productType1, subcategory2, productType2 }) => {
  return (
    <div className='CategoryPage'>
      <div className='section'>
        <img src={`/images/category_page/${category._id}/img1.jpg`} alt={productType1} />
        <div className='overtext'>
          <h2>{productType1}</h2>
          <a href={`/${category.category_name.toLowerCase()}/${subcategory1.toLowerCase()}/${productType1.toLowerCase()}`}>Cumpara</a>
        </div>
        <img src={`/images/category_page/${category._id}/img2.jpg`} alt={productType1} />
      </div>
      <div className='section'>
        <img src={`/images/category_page/${category._id}/img3.jpg`} alt={productType2} />
        <div className='overtext'>
          <h2>{productType2}</h2>
          <a href={`/${category.category_name.toLowerCase()}/${subcategory2.toLowerCase()}/${productType2.toLowerCase()}`}>Cumpara</a>
        </div>
        <img src={`/images/category_page/${category._id}/img4.jpg`} alt={productType2} />
      </div>
    </div>
  )
}

export default CategoryPage