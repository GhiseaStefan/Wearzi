import './ViewSingleUser.css'

const ViewSingleUser = ({ user, handleDelete }) => {
  return (
    <div className='ViewSingleUser'>
      <div className='item-container'>
        <p>email: {user.email}</p>
        <p>nume: {user.nume}</p>
        <p>prenume: {user.prenume}</p>
        <p>telefon: {user.telefon}</p>
        <p>zi_nastere: {user.zi_nastere}</p>
      </div>
      <div className='item-container'>
        <p>judet: {user.judet}</p>
        <p>oras: {user.oras}</p>
        <p>strada: {user.strada}</p>
        <p>nr_adresa: {user.nr_adresa}</p>
        <p>cod_postal: {user.cod_postal}</p>
      </div>
      <div className='buttons'>
        <button className='delete-item' onClick={() => handleDelete(user._id)}></button>
      </div>
    </div>
  )
}

export default ViewSingleUser