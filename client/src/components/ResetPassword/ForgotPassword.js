import { useState } from 'react'
import './ForgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const SERVER = 'http://localhost:8123'
      const response = await fetch(`${SERVER}/user/forgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
      } else {
        setEmail('');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <div className='ForgotPassword'>
      <h2>Resetare Parola</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-item'>
          <label>Email</label>
          <input type='email' value={email} onChange={handleEmailChange} />
        </div>
        {error && <div className='error'>{error}</div>}
        <input type='submit' value='Trimitere Email' />
      </form>
    </div>
  )
}

export default ForgotPassword