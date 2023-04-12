import { useEffect, useState } from "react"

import fetchSubcategoriesByCategory from "../App/generalFunctions/fetchSubcategoriesByCategory"
import fetchProductTypesBySubcategory from '../App/generalFunctions/fetchProductTypesBySubcategory'

const VerticalNavBar = ({ category, subcategory, productType }) => {
  const [subcategories, setSubcategories] = useState({})
  const [productTypes, setProductTypes] = useState({})

  useEffect(() => {
    fetchSubcategoriesByCategory(category._id).then(s => setSubcategories(s))
    fetchProductTypesBySubcategory(subcategory._id).then(pt => setProductTypes(pt))
  }, [])

  return (
    <div className="VerticalNavBar">
      <ul className="subcategory-list">
        {Object.values(subcategories).map(s => {
          return (
            <li key={s._id}>
              <a
                className={s._id === subcategory._id ? 'active-subcategory' : ''}
                href={`/${category.category_name.toLowerCase()}/${s.subcategory_name.toLowerCase()}`}
              >
                {s.subcategory_name}
              </a>
              {s._id === subcategory._id &&
                <ul className="product-type-list">
                  {Object.values(productTypes).map(pt => {
                    const productTypeName = pt.product_type_name.toLowerCase().replace(/ /g, "+");
                    return (
                      <li key={pt._id}>
                        <a
                          className={(productType && pt._id === productType._id) ? 'active-product-type' : ''}
                          href={`/${category.category_name.toLowerCase()}/${subcategory.subcategory_name.toLowerCase()}/${productTypeName}`}
                        >
                          {pt.product_type_name}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              }
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default VerticalNavBar