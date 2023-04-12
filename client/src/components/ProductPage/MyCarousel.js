import { useState } from 'react'

import './MyCarousel.css'

const MyCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleClick = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className='MyCarousel'>
      <div className='thumbnails'>
        {images.map((image, index) => (
          <div
            key={index}
            className={`thumbnail ${index === currentIndex ? 'active-thumbnail' : ''}`}
            onClick={() => handleClick(index)}
          >
            <img src={image} alt='' />
          </div>
        ))}
      </div>
      <div className='main-image'>
        <img src={images[currentIndex]} alt='' />
      </div>
    </div>
  )
}

export default MyCarousel