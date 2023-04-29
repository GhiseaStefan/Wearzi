import { useParams } from 'react-router-dom'
import { useState } from 'react';

import './ResetPassword.css'

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const SERVER = 'http://localhost:8123'
        const response = await fetch(`${SERVER}/user/resetPassword/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password, confirmPassword }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.message);
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      setError('Parolele nu se potrivesc')
    }
  }

  return (
    <div className='ResetPassword'>
      <div className='reset-container'>
        <h2>Resetare parola</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-item'>
            <label>Parola noua</label>
            <input type='password' onChange={handlePasswordChange} />
          </div>
          <div className='form-item'>
            <label>Confirmare parola noua</label>
            <input type='password' onChange={handleConfirmPasswordChange} />
          </div>
          {error && <div className='error'>{error}</div>}
          <input type='submit' value='Reseteaza parola' />
        </form>
      </div>
    </div>
  )
}

export default ResetPassword