import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel'

import './CarouselHome.css'
import "react-responsive-carousel/lib/styles/carousel.min.css";

const CarouselHome = () => {
  const [showSlideInfo, setShowSlideInfo] = useState(false);

  const handleImageSlide = () => {
    setShowSlideInfo(false);
    setTimeout(() => {
        setShowSlideInfo(true);
    }, 800)
}

  useEffect(() => {
    handleImageSlide();
  }, [])

  return (
    <div className='CarouselHome'>
      <Carousel
        className='carousel-models'
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showIndicators={false}
        showThumbs={false}
        showStatus={false}
        onChange={() => handleImageSlide()}
      >
        <div>
          <img src='images/carousel/Model1.png' alt='Model 1' />
          <div className={`slide-info ${showSlideInfo ? 'show' : ''}`}>
            <p>Pret Special</p>
            <h2>Colectie Noua</h2>
            <div>Descopera Mai Multe</div>
          </div>
        </div>
        <div>
          <img src='images/carousel/Model2.png' alt='Model 2' />
          <div className={`slide-info ${showSlideInfo ? 'show' : ''}`}>
            <p>Pret Special</p>
            <h2>Colectie Noua</h2>
            <div>Descopera Mai Multe</div>
          </div>
        </div>
        <div>
          <img src='images/carousel/Model3.png' alt='Model 3' />
          <div className={`slide-info ${showSlideInfo ? 'show' : ''}`}>
            <p>Pret Special</p>
            <h2>Colectie Noua</h2>
            <div>Descopera Mai Multe</div>
          </div>
        </div>
      </Carousel>
    </div>
  )
}

export default CarouselHome