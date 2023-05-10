import { useEffect, useRef, useState } from 'react'

import './ProductsContainer.css'

import Product from './Product'
import VerticalNavBar from './VerticalNavBar'
import loadMarimi from './functions/loadMarimi'
import showEditItem from './functions/showEditItem'
import loadCulori from './functions/loadCulori'
import sortAndFilter from './functions/sortAndFilter'
import addSortFilter from './functions/addSortFilter'
import addMarimeFilter from './functions/addMarimeFilter'
import addCuloareFilter from './functions/addCuloareFilter'
import addPretFilter from './functions/addPretFilter'
import removeFilters from './functions/removeFilters'
import fetchProductsBySubcategory from '../App/generalFunctions/fetchProductsBySubcategory'
import getFirstFields from './functions/getFirstFields'
import loadMoreProducts from './functions/loadMoreProducts'
import fetchProductsByProductType from '../App/generalFunctions/fetchProductsByProductType'

const ProductsContainer = ({ containerType, category, subcategory, productType }) => {
  const NR_PRODUCTS = 100;
  const [products, setProducts] = useState({})
  const [displayedProducts, setDisplayedProducts] = useState();
  const [containerProducts, setContainerProducts] = useState({})
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const [marimi, setMarimi] = useState([])
  const [culori, setCulori] = useState([])
  const [pretMin, setPretMin] = useState(null)
  const [pretMax, setPretMax] = useState(null)
  const [filters, setFilters] = useState({
    sort: "",
    marimi: [],
    culori: [],
    preturi: [null, null]
  })
  const [showRemoveFilters, setShowRemoveFilters] = useState(false);

  const barRefs = {
    sortareRef: useRef(null),
    marimeRef: useRef(null),
    culoareRef: useRef(null),
    pretRef: useRef(null)
  }
  const marimiRefs = useRef({})
  const culoriRefs = useRef({})
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (containerType === 'Subcategory') {
      fetchProductsBySubcategory(subcategory._id)
        .then((p) => {
          const filteredProducts = Object.values(p).filter((product) => product.quantity > 0);
          setProducts(Object.fromEntries(filteredProducts.map(product => [product._id, product])));
          setIsDataLoaded(true);
        });
    }
    if (containerType === 'ProductType') {
      fetchProductsByProductType(productType._id)
        .then((p) => {
          const filteredProducts = Object.values(p).filter((product) => product.quantity > 0);
          setProducts(Object.fromEntries(filteredProducts.map(product => [product._id, product])));
          setIsDataLoaded(true);
        });
    }
  }, []);


  useEffect(() => {
    setMarimi(loadMarimi(products))
    setCulori(loadCulori(products))
    setDisplayedProducts(Math.min(Object.values(products).length, NR_PRODUCTS))
  }, [products])

  useEffect(() => {
    setContainerProducts(getFirstFields(products, displayedProducts))
    if (isDataLoaded) {
      const total = Object.values(products).length
      const progressBar = progressBarRef.current;
      progressBar.style.width = `${displayedProducts / total * 100}%`;
    }
  }, [products, displayedProducts])

  useEffect(() => {
    sortAndFilter(filters, products, setShowRemoveFilters, setContainerProducts, displayedProducts, setDisplayedProducts);
  }, [filters, displayedProducts])

  return (
    <>
      {isDataLoaded &&
        <div className='ProductsContainer'>
          <VerticalNavBar category={category} subcategory={subcategory} productType={productType} />
          <div className='products-container-content'>
            <div className='edit-bar'>
              <div className='edit-item' ref={barRefs.sortareRef}>
                <div className='edit-item-name' onClick={() => showEditItem(barRefs.sortareRef, barRefs)}>
                  Sortare dupa <span className="arrow"></span>
                </div>
                <div className='dropdown-container'>
                  <div className='dropdown-item'>
                    <input type='radio' id='pretCrescator' name='sort' value='pretCrescator' onChange={(e) => addSortFilter(e, filters, setFilters)} />
                    <label htmlFor='pretCrescator'>Pret crescator</label>
                  </div>
                  <div className='dropdown-item'>
                    <input type='radio' id='pretDescrescator' name='sort' value='pretDescrescator' onChange={(e) => addSortFilter(e, filters, setFilters)} />
                    <label htmlFor='pretDescrescator'>Pret descrescator</label>
                  </div>
                  <div className='dropdown-item'>
                    <input type='radio' id='celMaiNou' name='sort' value='celMaiNou' onChange={(e) => addSortFilter(e, filters, setFilters)} />
                    <label htmlFor='celMaiNou'>Cel mai nou</label>
                  </div>
                </div>
              </div>
              <div className='edit-item' ref={barRefs.marimeRef}>
                <div className='edit-item-name' onClick={() => showEditItem(barRefs.marimeRef, barRefs)}>
                  Marime <span className="arrow"></span>
                </div>
                <div className='dropdown-container'>
                  {marimi.map(m => (
                    <div key={`size-${m}`} ref={r => marimiRefs.current[m] = r} className='dropdown-item'>
                      <input type='checkbox' id={`size-${m}`} value={m} onChange={(e) => addMarimeFilter(e, filters, setFilters)} />
                      <label htmlFor={`size-${m}`}>{m}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className='edit-item' ref={barRefs.culoareRef}>
                <div className='edit-item-name' onClick={() => showEditItem(barRefs.culoareRef, barRefs)}>
                  Culoare <span className="arrow"></span>
                </div>
                <div className='dropdown-container'>
                  {culori.map(c => (
                    <div key={`color-${c}`} ref={r => culoriRefs.current[c] = r} className='dropdown-item'>
                      <input type='checkbox' id={`color-${c}`} value={c} onChange={(e) => addCuloareFilter(e, filters, setFilters)} />
                      <label htmlFor={`color-${c}`}>{c}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className='edit-item' ref={barRefs.pretRef}>
                <div className='edit-item-name' onClick={() => showEditItem(barRefs.pretRef, barRefs)}>
                  Pret <span className="arrow"></span>
                </div>
                <div className='dropdown-container'>
                  <div className='dropdown-item'>
                    <input type='text' placeholder='Pret minim...' id='pretMinim' onChange={(e) => setPretMin(e.target.value)} />
                  </div>
                  <div className='dropdown-item'>
                    <input type='text' placeholder='Pret maxim...' id='pretMaxim' onChange={(e) => setPretMax(e.target.value)} />
                  </div>
                  <div className='dropdown-item'>
                    <input className='normal-button' type='button' value='Filtrare' onClick={() => addPretFilter(pretMin, pretMax, filters, setFilters)} />
                  </div>
                </div>
              </div>
              {showRemoveFilters &&
                <div className='edit-item'>
                  <input className='normal-button' type='button' value='Sterge Filtre'
                    onClick={() => { removeFilters(setFilters, barRefs, marimiRefs, culoriRefs, setPretMin, setPretMax, setContainerProducts, getFirstFields(products, displayedProducts), Math.min(Object.values(products).length, NR_PRODUCTS), setDisplayedProducts) }} />
                </div>
              }
            </div>
            <div className='products-list'>
              {Object.values(containerProducts).slice(0, displayedProducts).map(p => (
                <Product key={p._id} product={p} />
              ))}
            </div>
            <div className='incarca-produse'>
              <p>{displayedProducts} din {Object.values(products).length} produse incarcate</p>
              <div ref={progressBarRef} className='progress-bar'></div>
              <input type='button' value='Mai multe produse' className='large-button' onClick={() => loadMoreProducts(products, displayedProducts, NR_PRODUCTS, setDisplayedProducts)} />
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default ProductsContainer