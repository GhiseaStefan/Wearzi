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
            {(category._id === '6405fa546fb18bc74bd3d9cb' || category._id === '640601ffbab3fa741b0ade07') ?
              <>
                {Object.values(subcategories).map(s => (
                  <Subcategory key={s._id} category={category} subcategory={s} />
                ))}
              </>
              :
              <>
                {Object.values(subcategories).map(s => (
                  <div key={s._id} className='dropdown-subcategory-2'>
                    <h2 className='subcategory-2-name'>{s.subcategory_name}</h2>
                    <img src={`/images/noutati/${s._id}.jpg`} alt={s.subcategory_name} />
                  </div>
                ))}
              </>
            }
          </div>
        </li>
      }
    </>
  )
}

export default Category