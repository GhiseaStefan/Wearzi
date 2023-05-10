const Product = ({ product }) => {
  const SERVER = 'http://localhost:8123'

  return (
    <div className='Product'>
      <a href={`/products/${product._id}`}><img src={`${SERVER}/images/products/${product._id}/img1.jpg`} alt={product.product_name} /></a>
      <h2>{product.product_name}</h2>
      {product.discount === 0 ?
        <h3>{product.price} RON</h3>
        :
        <>
          <h3>
            <span className="discount-text">{(product.price - product.price * product.discount).toFixed(2)} RON </span>
            <span className="not-discount-text">{product.price} RON</span>
          </h3>
          <div className="discount-tag">
            {product.discount * 100} %
          </div>
        </>
      }
    </div>
  )
}

export default Product