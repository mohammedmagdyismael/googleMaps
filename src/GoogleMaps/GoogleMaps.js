import React, { useState, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Polygon } from '@react-google-maps/api';
import { 
    ADD_KEY_HERE,
    defaultMapOptions,
    containerStyle,
    defaultCenter,
    defaultMapZoom,
    polygonComponentOptions,
    mapComponentOptions,
} from './Configs';
import './GoogleMaps.css'

const GoogleMaps = ({ onChange, points }) => {
  const [polygonAxis, setPolygonAxis] = useState(points);
  const [currentLoc, setCurrentLoc] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultMapZoom);
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: ADD_KEY_HERE,
  })


  const onLoad = useCallback(map => {
    new window.google.maps.LatLngBounds(currentLoc);
    map.setZoom(zoom)
  }, []);

  const onChangePoints = points => {
    onChange(points);
    setPolygonAxis(points);
  }
  

  
  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map(latLng => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
        onChangePoints(nextPath);
    }
  }, [setPolygonAxis]);

  const onLoadPolygon = useCallback(
    polygon => {
      polygonRef.current = polygon;
      const path = polygon.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  const onUnmountPolygon = useCallback(() => {
    listenersRef.current.forEach(lis => lis.remove());
    polygonRef.current = null;
  }, []);

  const onClickMap = e => {
    const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    onChangePoints([...polygonAxis, point]);
  }

  const onResetMap = () => {
    setZoom(defaultMapZoom);
    setCurrentLoc(defaultCenter);
  }

  const clearPoints = () => {
    onChangePoints([]);
  };


  return isLoaded ? (
        <GoogleMap
          streetView
          mapContainerStyle={containerStyle}
          center={defaultMapZoom}
          onLoad={onLoad}
          defaultOptions={defaultMapOptions}
          options={mapComponentOptions}
          onClick={onClickMap}
        >
          <div className='btns-container'>
            <button className='reset-roi' onClick={() => clearPoints()}>
              Reset
            </button>
            <button
              className='re-center'
              onClick={() => onResetMap()}>
              ReCenter
            </button>
          </div>
          { /* Child components, such as markers, info windows, etc. */ }
          <Polygon
            options={polygonComponentOptions}
            paths={[polygonAxis]}
            editable
            onLoad={onLoadPolygon}
            onUnmount={onUnmountPolygon}
            onMouseUp={onEdit}
            onDragEnd={onEdit}
          />
        </GoogleMap>
  ) : <></>
}

export default React.memo(GoogleMaps)