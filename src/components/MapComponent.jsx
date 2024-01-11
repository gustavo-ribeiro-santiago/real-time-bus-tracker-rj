import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import { MapContainer, TileLayer } from 'react-leaflet';
import Markers from './Markers.jsx';
import { useState } from 'react';

function MapComponent({ data, filteredBusLines }) {
  const [map, setMap] = useState(null);

  return (
    <section>
      <MapContainer
        className="map-container"
        center={[-22.908333, -43.196388]} // Set initial coordinates
        zoom={10} // Set initial zoom level
        whenReady={(mapInstance) => setMap(mapInstance)}
        zoomControl={false}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          id="mapbox/streets-v11"
          accessToken="pk.eyJ1IjoiZ3VzdGF2b3Jpc2EiLCJhIjoiY2xwbnZ4c2F6MGpzMzJpcW5vbzRyNzhrbSJ9.0NGf0a40DCvZq-W0IQBVYw"
        />
        <MarkerClusterGroup>
          <Markers map={map} data={data} filteredBusLines={filteredBusLines} />
        </MarkerClusterGroup>
      </MapContainer>
    </section>
  );
}

export default MapComponent;
