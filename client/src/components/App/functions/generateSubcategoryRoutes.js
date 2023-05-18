import { Route } from 'react-router-dom'

import ProductsContainer from '../../ProductsContainer/ProductsContainer';

const generateSubcategoryRoutes = (categories, subcategories) => {
    return Object.values(subcategories).map((s) => {
        if (s.category_id === '6405fa546fb18bc74bd3d9cb' || s.category_id === '640601ffbab3fa741b0ade07') {
            return (
                <Route
                    key={s._id}
                    path={`${categories[s.category_id].category_name.toLowerCase()}/${s.subcategory_name.toLowerCase()}`}
                    element={<ProductsContainer containerType='Subcategory' category={categories[s.category_id]} subcategory={s} />}
                />
            );
        }
        return null;
    });
};

export default generateSubcategoryRoutes;