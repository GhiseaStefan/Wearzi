import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './User.css'

const Login = ({ setLoggedIn }) => {
  const SERVER = 'http://localhost:8123'
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevState => ({ ...prevState, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${SERVER}/user/login`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
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
              window.location.href = '/';
            });
          }
        });
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <div className='User'>
      <div className='container'>
        <div className='switch-mode'>
          <div onClick={() => navigate('/register')}>Inregistreaza-te</div>
          <div className='switch-mode-active' onClick={() => navigate('/login')}>Intra in cont</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='form-item'>
            <label>Email</label>
            <input type='email' name='email' onChange={handleChange}></input>
          </div>
          <div className='form-item'>
            <label>Parola</label>
            <input type='password' name='password' onChange={handleChange}></input>
          </div>
          <input type='submit' value='Intra in cont' />
          {error && <div className='error'>{error}</div>}
        </form>
        <a href='/forgotPassword'>Mi-am uitat parola</a>
      </div>
    </div>
  )
}

export default Login