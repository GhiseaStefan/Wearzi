import './Homepage.css'

import CarouselHome from './CarouselHome'
import NewClothes from './NewClothes'

const Homepage = () => {
  return (
    <div className='Homepage'>
      <CarouselHome />
      <NewClothes />
    </div>
  )
}

export default Homepage