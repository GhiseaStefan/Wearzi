import './CategoryPage.css'

const CategoryPage = ({ categoryId, productType1, productType2 }) => {
  return (
    <div className='CategoryPage'>
      <div className='section'>
        <img src={`/images/category_page/${categoryId}/img1.jpg`} alt={productType1} />
        <div className='overtext'>
          <h2>{productType1}</h2>
          <a href='/barbati/imbracaminte/blugi'>Cumpara</a>
        </div>
        <img src={`/images/category_page/${categoryId}/img2.jpg`} alt={productType1} />
      </div>
      <div className='section'>
        <img src={`/images/category_page/${categoryId}/img3.jpg`} alt={productType2} />
        <div className='overtext'>
          <h2>{productType2}</h2>
          <a href='/barbati/imbracaminte/hanorace'>Cumpara</a>
        </div>
        <img src={`/images/category_page/${categoryId}/img4.jpg`} alt={productType2} />
      </div>
    </div>
  )
}

export default CategoryPage