import { Route } from 'react-router-dom'

import ProductPage from '../../ProductPage/ProductPage';

const generateProductRoutes = (products, cartItems, setCartItems) => {
    if (Object.values(products).length !== 0) {
        return Object.values(products).map(prod => {
            return <Route key={prod._id} path={`/products/${prod._id}`} element={<ProductPage product={prod} cartItems={cartItems} setCartItems={setCartItems} />} />
        });
    }
    return null;
};

export default generateProductRoutes;