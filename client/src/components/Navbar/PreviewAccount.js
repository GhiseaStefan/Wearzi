import './PreviewAccount.css'

const PreviewAccount = ({ loggedIn, setLoggedIn }) => {

  const handleLogout = async () => {
    try {
      const SERVER = 'http://localhost:8123'
      const response = await fetch(`${SERVER}/user/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        setLoggedIn(false);
        localStorage.setItem("cartItems", JSON.stringify({}));
        window.location.href = '/';
      } else {
        console.error('Logout error:', response.statusText);
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <div className='PreviewAccount'>
      {loggedIn ?
        <>
          <button onClick={handleLogout}>Delogare</button>
        </>
        :
        <>
          <a href='/login'>Intra in cont</a>
          <a href='/register'>Creeaza cont</a>
        </>
      }
    </div>
  )
}

export default PreviewAccount