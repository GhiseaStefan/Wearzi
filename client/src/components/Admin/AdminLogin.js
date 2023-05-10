import { useState } from 'react';

import './AdminLogin.css';

const AdminLogin = ({ setAuthenticated }) => {
  const SERVER = 'http://localhost:8123'
  const [loginData, setLoginData] = useState({
    username: '',
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
      await fetch(`${SERVER}/admin/login`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ username: loginData.username, password: loginData.password }),
        credentials: 'include'
      })
        .then(response => {
          if (response.status >= 400 && response.status <= 500) {
            response.json().then(res => setError(res.message));
          }
          if (response.status >= 200 && response.status < 300) {
            response.json().then(res => {
              setAuthenticated(true);
              setError('');
            });
          }
        });
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <div className='Admin'>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className='form-item'>
            <label>Username</label>
            <input type='text' name='username' onChange={handleChange}></input>
          </div>
          <div className='form-item'>
            <label>Parola</label>
            <input type='password' name='password' onChange={handleChange}></input>
          </div>
          <input type='submit' value='Intra in cont' />
          {error && <div className='error'>{error}</div>}
        </form>
      </div>
    </div>
  )
}

export default AdminLogin