import React,{ useState } from 'react'
import GoogleMaps from './GoogleMaps';

const App = () => {

  const [points, setPoints] = useState([]);
  
  
  const renderCoordinates = () => {
    let pointsCoordinates = ''
    if (points.length) {
      points.forEach(pnt => {
        pointsCoordinates = `${pointsCoordinates}Lat: ${pnt.lat}\n Lng: ${pnt.lng}\n\n`
      })
    }
    return pointsCoordinates || '-';
  }

  return (
    <div className='container'>
      <div className='map-container'>
        <GoogleMaps points={points} onChange={setPoints} />
      </div>
      <div className='coordinates-container'>
        <p>Polygon Co-ordinates:</p>
        <p>{renderCoordinates()}</p>
      </div>
    </div>
  )
}

export default App