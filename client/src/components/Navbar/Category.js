import { useEffect, useState } from 'react'

import Subcategory from './Subcategory';
import handleHover from './functions/handleHover'
import fetchSubcategoriesByCategory from '../App/generalFunctions/fetchSubcategoriesByCategory'

const Category = ({ category, categoryRefs }) => {
  const [subcategories, setSubcategories] = useState({})
  const isDataLoaded = Object.values(subcategories).length !== 0;

  useEffect(() => {
    fetchSubcategoriesByCategory(category._id).then(s => setSubcategories(s))
  }, [])

  return (
    <>
      {isDataLoaded &&
        <li className='Category' ref={r => categoryRefs.current[category._id] = r}>
          <a
            className='category-name'
            href={`/${category.category_name.toLowerCase()}`}
            onMouseOver={() => handleHover(category._id, 'over', categoryRefs)}
            onMouseOut={() => handleHover(category._id, 'out', categoryRefs)}
          >
            {category.category_name}
          </a>
          <div
            className='dropdown-container'
            onMouseOver={() => handleHover(category._id, 'over', categoryRefs)}
            onMouseOut={() => handleHover(category._id, 'out', categoryRefs)}
          >
            {Object.values(subcategories).map(s => (
              <Subcategory key={s._id} category={category} subcategory={s} />
            ))}
          </div>
        </li>
      }
    </>
  )
}

export default Category