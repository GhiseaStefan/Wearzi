import { useState } from 'react'

import './AccountData.css'

const AccountData = ({ user }) => {
  const [userData, setUserData] = useState({
    email: user.email,
    nume: user.nume,
    prenume: user.prenume,
    telefon: user.telefon ? user.telefon : '+40',
    zi_nastere: user.zi_nastere ? user.zi_nastere : '',
    judet: user.judet ? user.judet : '',
    oras: user.oras ? user.oras : '',
    strada: user.strada ? user.strada : '',
    nr_adresa: user.nr_adresa ? user.nr_adresa : '',
    cod_postal: user.cod_postal ? user.cod_postal : '',
    old_password: '',
    new_password: '',
    confirm_new_password: ''
  })
  const [errors, setErrors] = useState({
    telefon: '',
    cod_postal: '',
    old_password: '',
    new_password: '',
    confirm_new_password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData(prevState => ({ ...prevState, [name]: value }))

    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
    }
  }

  const handleAccountChange = async () => {
    if (userData.new_password === userData.confirm_new_password) {
      try {
        const SERVER = 'http://localhost:8123'
        const response = await fetch(`${SERVER}/user/modify`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrors(errorData.errors);
        } else {
          window.location.href = '/account';
        }

      } catch (error) {
        console.error(error);
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirm_new_password: 'Parolele nu se potrivesc'
      }))
    }
  };

  return (
    <div className='AccountData'>
      <div className='account-item'>
        <h2>Datele mele</h2>
        <div className='form-container'>
          <div className='form-pair'>
            <div className='form-item'>
              <label>Prenume</label>
              <input type='text' name='prenume' value={userData.prenume} onChange={handleChange} />
            </div>
            <div className='form-item'>
              <label>Nume</label>
              <input type='text' name='nume' value={userData.nume} onChange={handleChange} />
            </div>
          </div>
          <div className='form-pair'>
            <div className='form-item'>
              <label>Telefon</label>
              <input type='text' name='telefon' value={userData.telefon} onChange={handleChange} />
              {errors.telefon && <div className='error'>{errors.telefon}</div>}
            </div>
            <div className='form-item'>
              <label>E-mail</label>
              <input type='email' name='email' value={userData.email} onChange={handleChange} disabled />
            </div>
          </div>
          <div className='form-item'>
            <label>Ziua de nastere</label>
            <input type='date' name='zi_nastere' value={userData.zi_nastere} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className='account-item'>
        <h2>Adresa</h2>
        <div className='form-container'>
          <div className='form-pair'>
            <div className='form-item'>
              <label>Judet</label>
              <input type='text' name='judet' value={userData.judet} onChange={handleChange} />
            </div>
            <div className='form-item'>
              <label>Oras</label>
              <input type='text' name='oras' value={userData.oras} onChange={handleChange} />
            </div>
          </div>
          <div className='form-pair'>
            <div className='form-item'>
              <label>Strada</label>
              <input type='text' name='strada' value={userData.strada} onChange={handleChange} />
            </div>
            <div className='form-item'>
              <label>Nr Adresa</label>
              <input type='text' name='nr_adresa' value={userData.nr_adresa} onChange={handleChange} />
            </div>
          </div>
          <div className='form-item'>
            <label>Cod Postal</label>
            <input type='text' name='cod_postal' value={userData.cod_postal} onChange={handleChange} />
            {errors.cod_postal && <div className='error'>{errors.cod_postal}</div>}
          </div>
        </div>
      </div>

      <div className='account-item'>
        <h2>Modificare parola</h2>
        <div className='form-container'>
          <div className='form-item'>
            <label>Parola actuala</label>
            <input type='password' name='old_password' onChange={handleChange} />
            {errors.old_password && <div className='error'>{errors.old_password}</div>}
          </div>
          <div className='form-item'>
            <label>Parola noua</label>
            <input type='password' name='new_password' onChange={handleChange} />
            {errors.new_password && <div className='error'>{errors.new_password}</div>}
          </div>
          <div className='form-item'>
            <label>Confirmare parola</label>
            <input type='password' name='confirm_new_password' onChange={handleChange} />
            {errors.confirm_new_password && <div className='error'>{errors.confirm_new_password}</div>}
          </div>
        </div>
      </div>

      <div className='form-button'>
        <button onClick={handleAccountChange}>Salveaza modificarile</button>
      </div>
    </div>
  )
}

export default AccountData