import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import './App.css'
import "@fontsource/poppins";

import Homepage from '../Homepage/Homepage';
import CategoryPage from '../CategoryPage/CategoryPage';
import ShoppingCart from '../Cart/ShoppingCart';
import Register from '../User/Register';
import Login from '../User/Login';
import ResetPassword from '../ResetPassword/ResetPassword';
import ForgotPassword from '../ResetPassword/ForgotPassword';
import Admin from '../Admin/Admin';
import AppLayout from './AppLayout';
import fetchSubcategories from './generalFunctions/fetchSubcategories'
import fetchProductTypes from './generalFunctions/fetchProductTypes'
import fetchCategories from './generalFunctions/fetchCategories';
import fetchProducts from './generalFunctions/fetchProducts';
import storageChangeMultipleTabs from './functions/storageChangeMultipleTabs';
import checkLoggedIn from './functions/checkLoggedIn';
import getUserCart from './functions/getUserCart';
import updateUserCart from './functions/updateUserCart';
import generateSubcategoryRoutes from './functions/generateSubcategoryRoutes';
import generateProductTypeRoutes from './functions/generateProductTypeRoutes';
import generateProductRoutes from './functions/generateProductRoutes';
import generateAccountRoutes from './functions/generateAccountRoutes';

const App = () => {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({})
  const [subcategories, setSubcategories] = useState({})
  const [productTypes, setProductTypes] = useState({})
  const [products, setProducts] = useState({})
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    return storedCartItems || {};
  });
  const [hasDataFinishedLoading, setHasDataFinishedLoading] = useState(false);
  const [hasProductsFinishedLoading, setHasProductsFinishedLoading] = useState(false);

  useEffect(() => {
    checkLoggedIn(setUser, setLoggedIn, setLoading);
    Promise.all([
      fetchCategories(),
      fetchSubcategories(),
      fetchProductTypes(),
    ]).then(([c, s, pt]) => {
      setCategories(c);
      setSubcategories(s);
      setProductTypes(pt);
      setHasDataFinishedLoading(true);
    });

    fetchProducts().then((p) => {
      setProducts(p);
      setHasProductsFinishedLoading(true);
    });

    storageChangeMultipleTabs(setCartItems);
  }, []);

  useEffect(() => {
    if (Object.values(cartItems).length !== 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
    updateUserCart(cartItems, loggedIn, user);
  }, [cartItems]);

  useEffect(() => {
    if (loggedIn && user._id) {
      getUserCart(loggedIn, user).then((userCartItems) => {
        const combinedCartItems = { ...cartItems, ...userCartItems };
        setCartItems(combinedCartItems);
      });
    }
  }, [loggedIn, user]);

  const appLayoutState = { cartItems, loggedIn, setLoggedIn, user, hasDataFinishedLoading, hasProductsFinishedLoading, categories, subcategories, productTypes, products }

  return (
    <div className='App'>
      <AppLayout appLayoutState={appLayoutState}>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/barbati' element={<CategoryPage category={categories['6405fa546fb18bc74bd3d9cb']} subcategory1='Imbracaminte' productType1='Blugi' subcategory2='Imbracaminte' productType2='Hanorace' />} />
          <Route path='/femei' element={<CategoryPage category={categories['640601ffbab3fa741b0ade07']} subcategory1='Imbracaminte' productType1='Fuste' subcategory2='Accesorii' productType2='Genti' />} />
          {generateSubcategoryRoutes(categories, subcategories)}
          {generateProductTypeRoutes(categories, subcategories, productTypes)}
          {generateProductRoutes(products, cartItems, setCartItems)}
          <Route path='/shoppingCart' element={<ShoppingCart cartItems={cartItems} setCartItems={setCartItems} loggedIn={loggedIn} user={user} />} />
          <Route path='/register' element={<Register setLoggedIn={setLoggedIn} />} />
          <Route path='/login' element={<Login setLoggedIn={setLoggedIn} />} />
          {generateAccountRoutes(loggedIn, loading, user)}
          <Route path='/forgotPassword' element={<ForgotPassword />} />
          <Route path='/resetPassword/:token' element={<ResetPassword />} />
          <Route path='/admin/*' element={<Admin />} />
        </Routes>
      </AppLayout>
    </div>
  )
}

export default App