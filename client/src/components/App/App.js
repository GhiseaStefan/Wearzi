import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

import './App.css'
import "@fontsource/poppins";

import Navbar from '../Navbar/Navbar'
import Homepage from '../Homepage/Homepage';
import CategoryPage from '../CategoryPage/CategoryPage';
import ProductsContainer from '../ProductsContainer/ProductsContainer';
import ProductPage from '../ProductPage/ProductPage';
import Footer from '../Footer/Footer'
import ShoppingCart from '../Cart/ShoppingCart';
import AddProductTemp from '../Admin/AddProductTemp';
import NotFound from '../NotFound/NotFound';
import fetchSubcategories from './generalFunctions/fetchSubcategories'
import fetchProductTypes from './generalFunctions/fetchProductTypes'
import fetchCategories from './generalFunctions/fetchCategories';
import fetchProducts from './generalFunctions/fetchProducts';
import storageChangeMultipleTabs from './functions/storageChangeMultipleTabs';
import Register from '../User/Register';
import Login from '../User/Login';
import Account from '../User/Account';
import ResetPassword from '../ResetPassword/ResetPassword';
import ForgotPassword from '../ResetPassword/ForgotPassword';
import IntelligentSuggestion from '../IntelligentSuggestion/IntelligentSuggestion';

const App = () => {
  const [categories, setCategories] = useState({})
  const [subcategories, setSubcategories] = useState({})
  const [productTypes, setProductTypes] = useState({})
  const [products, setProducts] = useState({})
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    return storedCartItems || {};
  });
  const isDataLoaded = Object.values(categories).length !== 0 && Object.values(subcategories).length !== 0 && Object.values(productTypes).length !== 0

  useEffect(() => {
    fetchCategories().then(c => setCategories(c))
    fetchSubcategories().then(s => setSubcategories(s))
    fetchProductTypes().then(pt => setProductTypes(pt))
    fetchProducts().then(p => setProducts(p))
    storageChangeMultipleTabs(setCartItems)
  }, [])

  useEffect(() => {
    if (Object.values(cartItems).length !== 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const Layout = ({ children }) => {
    const { pathname } = useLocation()
    const definedPaths = [
      '/',
      '/barbati',
      '/femei',
      ...Object.values(subcategories).map((s) => {
        if (
          s.category_id === '6405fa546fb18bc74bd3d9cb' ||
          s.category_id === '640601ffbab3fa741b0ade07'
        ) {
          return `/${categories[s.category_id].category_name.toLowerCase()}/${s.subcategory_name.toLowerCase()}`;
        }
        return null;
      }),
      ...Object.values(productTypes).map((pt) => {
        const s = subcategories[pt.subcategory_id];
        const c = categories[s.category_id];
        const productTypeName = pt.product_type_name.toLowerCase().replace(/ /g, "+");
        return `/${c.category_name.toLowerCase()}/${s.subcategory_name.toLowerCase()}/${productTypeName}`;
      }),
      ...Object.values(products).map((p) => `/products/${p._id}`),
      '/shoppingCart',
      '/register',
      '/login',
      '/forgotPassword',
      '/resetPassword/*',
      '/account/accountData',
      '/account/orderHistory',
      '/intelligentSuggestion',
      '/admin',
    ];

    const wildcardPatterns = [/^\/resetPassword\/.+/];
    if (!definedPaths.includes(pathname) && !wildcardPatterns.some((pattern) => pattern.test(pathname))) {
      return <NotFound />;
    }
    if (pathname === '/admin' || /^\/resetPassword\/.+/.test(pathname) || pathname === '/forgotPassword') {
      return <>{children}</>
    }
    return (
      <>
        <Navbar cartItems={cartItems} loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user} />
        {children}
        <Footer />
      </>
    )
  }

  // user mode
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const checkLoggedIn = async () => {
    const SERVER = 'http://localhost:8123';
    try {
      const response = await fetch(`${SERVER}/user/auth`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 200) {
        const data = await response.json();
        setUser(data.user);
        setLoggedIn(true);
      } else if (response.status === 401) {
        setLoggedIn(false);
        setUser({});
      } else {
        setLoggedIn(false);
        setUser({});
        console.error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      setLoggedIn(false);
      setUser({});
      console.error('Error fetching auth status:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkLoggedIn()
  }, []);

  // User Cart
  const updateUserCart = async (updatedCartItems) => {
    if (loggedIn) {
      try {
        const SERVER = 'http://localhost:8123';
        const response = await fetch(`${SERVER}/user/updateCart`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            cartItems: updatedCartItems
          })
        });
      } catch (err) {
        console.warn(err);
      }
    }
  }

  const getUserCart = async () => {
    if (loggedIn) {
      try {
        const SERVER = 'http://localhost:8123';
        const response = await fetch(`${SERVER}/user/updateCart?userId=${user._id}`);
        const data = await response.json();
        if (response.status === 200) {
          const userCartItems = data.cartItems;
          return userCartItems;
        }
      } catch (err) {
        console.warn(err);
      }
    }
    return {};
  }

  useEffect(() => {
    updateUserCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    if (loggedIn) {
      getUserCart().then((userCartItems) => {
        const combinedCartItems = { ...cartItems, ...userCartItems };
        setCartItems(combinedCartItems);
      });
    }
  }, [loggedIn]);


  // User Cart

  return (
    <div className='App'>
      {isDataLoaded &&
        <Layout>
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/barbati' element={
              <CategoryPage category={categories['6405fa546fb18bc74bd3d9cb']} subcategory1='Imbracaminte' productType1='Blugi' subcategory2='Imbracaminte' productType2='Hanorace' />}
            />
            <Route path='/femei' element={
              <CategoryPage category={categories['640601ffbab3fa741b0ade07']} subcategory1='Imbracaminte' productType1='Fuste' subcategory2='Accesorii' productType2='Genti' />}
            />
            {Object.values(subcategories).map((s) => {
              if (s.category_id === '6405fa546fb18bc74bd3d9cb' || s.category_id === '640601ffbab3fa741b0ade07') {
                return <Route
                  key={s._id}
                  path={`/${categories[s.category_id].category_name.toLowerCase()}/${s.subcategory_name.toLowerCase()}`}
                  element={<ProductsContainer containerType='Subcategory' category={categories[s.category_id]} subcategory={s} />}
                />
              }
            })}
            {Object.values(productTypes).map((pt) => {
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
            })}
            {Object.values(products).length !== 0 && Object.values(products).map(p => {
              return <Route key={p._id} path={`/products/${p._id}`} element={<ProductPage product={p} cartItems={cartItems} setCartItems={setCartItems} />} />
            })}
            <Route path='/shoppingCart' element={<ShoppingCart cartItems={cartItems} setCartItems={setCartItems} loggedIn={loggedIn} user={user} />} />
            <Route path='/register' element={<Register setLoggedIn={setLoggedIn} />} />
            <Route path='/login' element={<Login setLoggedIn={setLoggedIn} />} />
            {loggedIn ?
              <>
                <Route path='/account/*' element={<Account user={user} />} />
              </>
              :
              !loading &&
              <>
                <Route path='/account/*' element={<Navigate replace to='/login' />} />
              </>
            }
            <Route path='/forgotPassword' element={<ForgotPassword />} />
            <Route path='/resetPassword/:token' element={<ResetPassword />} />
            <Route path='/intelligentSuggestion' element={<IntelligentSuggestion />} />
            <Route path='/admin' element={<AddProductTemp />} />
          </Routes>
        </Layout>
      }
    </div>
  )
}

export default App