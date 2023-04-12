import { useEffect, useState } from "react";

import fetchProductTypesBySubcategory from '../App/generalFunctions/fetchProductTypesBySubcategory'

const Subcategory = ({ category, subcategory }) => {
  const [productTypes, setProductTypes] = useState({})
  const isDataLoaded = Object.values(productTypes).length !== 0;

  useEffect(() => {
    fetchProductTypesBySubcategory(subcategory._id).then(pt => setProductTypes(pt))
  }, [])

  return (
    <>
      {isDataLoaded &&
        <div className='dropdown-subcategory'>
          <h3>
            <a href={`/${category.category_name.toLowerCase()}/${subcategory.subcategory_name.toLowerCase()}`}>
              {subcategory.subcategory_name}
            </a>
          </h3>
          <ul>
            {Object.values(productTypes).map(pt => {
              const productTypeName = pt.product_type_name.toLowerCase().replace(/ /g, "+");
              return (
                <li key={pt._id}>
                  <a href={`/${category.category_name.toLowerCase()}/${subcategory.subcategory_name.toLowerCase()}/${productTypeName}`}>
                    {pt.product_type_name}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      }
    </>
  )
}

export default Subcategory