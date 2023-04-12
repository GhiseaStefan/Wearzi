import './Footer.css'

const Footer = () => {
  return (
    <div className='Footer'>
      <div className='item'>
        <h2>Ajutor</h2>
        <p>Intrebari Frecvente</p>
        <p>Contact</p>
        <p>Statusul comenzii mele</p>
        <p>Cum returnez</p>
        <p>Procesarea returnarii</p>
        <p>Livrari</p>
      </div>
      <div className='item'>
        <div className='subitem-1'>
          <h2>Modalitati de plata</h2>
          <div>
            <img src='/images/modalitati_plata/visa-logo.jpg' alt='visa logo' />
            <img src='/images/modalitati_plata/mastercard-logo.jpg' alt='mastercard logo' />
            <img src='/images/modalitati_plata/americanexpress-logo.jpg' alt='americanexpress logo' />
            <img src='/images/modalitati_plata/applepay-logo.jpg' alt='applepay logo' />
            <img src='/images/modalitati_plata/googlepay-logo.jpg' alt='googlepay logo' />
          </div>
        </div>
        <div className='subitem-2'>
          <h2>Urmareste-ne!</h2>
          <div>
            <a href='/'><i className="fa-brands fa-tiktok"></i></a>
            <a href='/'><i className="fa-brands fa-instagram"></i></a>
            <a href='/'><i className="fa-brands fa-facebook-f"></i></a>
          </div>
        </div>
      </div>
      <div className='item'>
        <h2>Reducere 15%</h2>
        <p className='p-small'>Prin abonare la newsletter</p>
        <form className='newsletter-form'>
          <input type='text' placeholder='Email...' />
          <input type='submit' value='' />
        </form>
      </div>
      <div className='item'>
        <h2>Politica De Confidentialitate</h2>
        <p>Politica de confidentialitate</p>
        <p>Politica privind cookie</p>
        <p>Setari cookie</p>
      </div>
    </div>
  )
}

export default Footer