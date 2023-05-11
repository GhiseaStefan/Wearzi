import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import AdminLogin from "./AdminLogin"
import AdminContent from "./AdminContent"
import NotFound from '../NotFound/NotFound'

const Admin = () => {
  const SERVER = 'http://localhost:8123'
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthenticated = async () => {
    try {
      const response = await fetch(`${SERVER}/admin/auth`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 200) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (err) {
      setAuthenticated(true);
      console.warn('Error fetching auth status:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const Layout = ({ children }) => {
    const { pathname } = useLocation();
    const definedPaths = [
      '/admin/content',
      '/admin/login',
      '/admin/content/addProducts',
      '/admin/content/viewProducts',
      '/admin/content/viewProductTypes',
      '/admin/content/addProductTypes',
      '/admin/content/viewSubcategories',
      '/admin/content/addSubcategories',
      '/admin/content/viewUsers'
    ];

    if (!definedPaths.includes(pathname)) {
      return <NotFound />;
    }
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <div>
      <Layout>
        <Routes>
          {authenticated ?
            <>
              <>
                <Route path='content/*' element={<AdminContent />} />
                <Route path='login' element={<Navigate replace to='/admin/content/viewProducts' />} />
                <Route path='content' element={<Navigate replace to='/admin/content/viewProducts' />} />
              </>
            </>
            :
            !loading &&
            <>
              <Route path='login' element={<AdminLogin setAuthenticated={setAuthenticated} />} />
              <Route path='content/*' element={<Navigate replace to='/admin/login' />} />
              <Route path='content' element={<Navigate replace to='/admin/login' />} />
            </>
          }
        </Routes>
      </Layout>
    </div>
  )
}

export default Admin