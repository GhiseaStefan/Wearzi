import discountedPrice from '../Cart/functions/discountedPrice'

const Orders = ({ user }) => {
  const SERVER = 'http://localhost:8123';

  const formatOrderDate = (orderDate) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'Europe/Bucharest',
    };
    return new Date(orderDate).toLocaleString('ro-RO', options);
  };

  return (
    <div>
      {user.orders.map((o) => (
        <div key={o.order_number} className='order-container'>
          <div className='order'>
            <h2>Comanda {o._id}_{o.order_number}</h2>
            <h4>Plasata la data de {formatOrderDate(o.order_date)}</h4>
            <h4>Total: {o.order_total} RON</h4>
            <h4>Produse cumparate:</h4>
            <div className='products-container'>
              {o.order_products.map((p) => (
                <div className='product' key={p._id}>
                  <div className='image-container'>
                    <img src={`${SERVER}/images/products/${p._id}/img1.jpg`} alt='' />
                  </div>
                  <div className='product-info-container'>
                    <h4>{p.product_name}</h4>
                    <h4>
                      {p.color} {p.size[0] !== '' && `- ${p.size.join(', ')}`}
                    </h4>
                    <h4>Cantitate: {p.quantity}</h4>
                    {p.discount === 0 ? (
                      <h4>{(p.price * p.quantity).toFixed(2)} RON</h4>
                    ) : (
                      <h4 className='bold'>{(discountedPrice(p.price, p.discount) * p.quantity).toFixed(2)} RON </h4>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;