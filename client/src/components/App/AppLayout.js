import { useLocation } from 'react-router-dom'

import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import NotFound from '../NotFound/NotFound';

const AppLayout = ({ appLayoutState, children }) => {
  const { cartItems, loggedIn, setLoggedIn, user, hasDataFinishedLoading, hasProductsFinishedLoading, categories, subcategories, productTypes, products } = appLayoutState;
  const { pathname } = useLocation()

  const isProductRoute = /^\/products\/.+/.test(pathname)

  if (!hasDataFinishedLoading) return null;

  if (!hasProductsFinishedLoading && isProductRoute) return null;

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
    '/shoppingCart',
    '/register',
    '/login',
    '/forgotPassword',
    '/resetPassword/*',
    '/account/accountData',
    '/account/orderHistory',
    '/intelligentSuggestion',
    '/admin/*',
  ];

  const anyRoute = (pathname) => {
    const routePatterns = [/^\/resetPassword\/.+/, /^\/admin\/.+/];
    return routePatterns.some((pattern) => pattern.test(pathname))
  }

  if (!definedPaths.includes(pathname) && !anyRoute(pathname) && !isProductRoute) {
    return <NotFound />;
  }

  if (anyRoute(pathname) || pathname === '/forgotPassword') {
    return <>{children}</>
  }

  return (<>
    <Navbar cartItems={cartItems} loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user} />
    {children}
    <Footer />
  </>)
}

export default AppLayout;