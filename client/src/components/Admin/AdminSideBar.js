import { useNavigate } from 'react-router-dom'
import './AdminSideBar.css'


const AdminSideBar = () => {
  const navigate = useNavigate();

  return (
    <div className='AdminSideBar'>
      <div className='side-bar'>
        <div className='item'>
          <h2>Produse</h2>
          <div className='subitem'>
            <h3 onClick={() => navigate('/admin/content/viewProducts')}>Vizualizare Produse</h3>
            <h3 onClick={() => navigate('/admin/content/addProducts')}>Adaugare Produse</h3>
          </div>
        </div>
        <div className='item'>
          <h2>Tipuri de produse</h2>
          <div className='subitem'>
            <h3 onClick={() => navigate('/admin/content/viewProductTypes')}>Vizualizare Tipuri de produse</h3>
            <h3 onClick={() => navigate('/admin/content/addProductTypes')}>Adaugare Tipuri de produse</h3>
          </div>
        </div>
        <div className='item'>
          <h2>Subcategorii</h2>
          <div className='subitem'>
            <h3 onClick={() => navigate('/admin/content/viewSubcategories')}>Vizualizare Subcategorii</h3>
            <h3 onClick={() => navigate('/admin/content/addSubcategories')}>Adaugare Subcategorii</h3>
          </div>
        </div>
        <div className='item'>
          <h2>Utilizatori</h2>
          <div className='subitem'>
            <h3 onClick={() => navigate('/admin/content/viewUsers')}>Vizualizare Utilizatori</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSideBar