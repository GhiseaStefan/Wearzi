import { Route } from 'react-router-dom'

import ProductsContainer from '../../ProductsContainer/ProductsContainer';

const generateProductTypeRoutes = (categories, subcategories, productTypes) => {
    return Object.values(productTypes).map((pt) => {
        const s = subcategories[pt.subcategory_id];
        const c = categories[s.category_id];
        const productTypeName = pt.product_type_name.toLowerCase().replace(/ /g, "+");
        return (
            <Route
                key={pt._id}
                path={`/${c.category_name.toLowerCase()}/${s.subcategory_name.toLowerCase()}/${productTypeName}`}
                element={<ProductsContainer containerType='ProductType' category={c} subcategory={s} productType={pt} />}
            />
        );
    });
};

export default generateProductTypeRoutes;