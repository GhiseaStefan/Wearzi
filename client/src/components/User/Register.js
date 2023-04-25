import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './User.css'

const Register = ({ setLoggedIn }) => {
  const SERVER = 'http://localhost:8123'
  const navigate = useNavigate()
  const [registerData, setRegisterData] = useState({
    email: '',
    nume: '',
    prenume: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prevState => ({ ...prevState, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password === registerData.confirmPassword) {
      try {
        await fetch(`${SERVER}/user/register`, {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ email: registerData.email, password: registerData.password, nume: registerData.nume, prenume: registerData.prenume }),
          credentials: 'include'
        })
          .then(response => {
            if (response.status >= 400 && response.status <= 500) {
              response.json().then(res => setError(res.message));
            }
            if (response.status >= 200 && response.status < 300) {
              response.json().then(res => {
                setLoggedIn(true)
                setError('');
                window.location.href = '/account';
              });
            }
          })
      } catch (err) {
        console.warn(err);
      }
    } else {
      setError("Parolele nu se potrivesc!")
    }
  }

  return (
    <div className='User'>
      <div className='container'>
        <div className='switch-mode'>
          <div className='switch-mode-active' onClick={() => navigate('/register')}>Inregistreaza-te</div>
          <div onClick={() => navigate('/login')}>Intra in cont</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='form-item'>
            <label>Email</label>
            <input type='email' name='email' onChange={handleChange}></input>
          </div>
          <div className='form-item'>
            <label>Nume</label>
            <input type='text' name='nume' onChange={handleChange}></input>
          </div>
          <div className='form-item'>
            <label>Prenume</label>
            <input type='text' name='prenume' onChange={handleChange}></input>
          </div>
          <div className='form-item'>
            <label>Parola</label>
            <input type='password' name='password' onChange={handleChange}></input>
          </div>
          <div className='form-item'>
            <label>Confirmare parola</label>
            <input type='password' name='confirmPassword' onChange={handleChange}></input>
          </div>
          <input type='submit' value='Creeaza cont' />
          {error && <div className='error'>{error}</div>}
        </form>
      </div>
    </div>
  )
}

export default Register