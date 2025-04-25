import * as L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { useEffect } from 'react';
import busIconImage from '../assets/bus.png';

var perimeters = new L.layerGroup();

function Markers({ map, data, filteredBusLines }) {
  useEffect(() => {
    // Draw the new perimeters on zoom in or zoom out
    map.target.on('zoomend', () => drawPerimeters());
  }, []);

  // Initialize busIDs variable to keep track and avoid repetition of buses (data may contain repeated buses)
  const busIDs = [];
  const busIcon = L.icon({
    iconUrl: busIconImage,
    iconSize: [32, 37],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // For each unique and not filtered out bus, create marker
  const markers = data.map(
    ({
      latitude,
      longitude,
      ordem: busID,
      linha: busLine,
      velocidade: speed,
      datahora,
    }) => {
      if (filteredBusLines.length && !filteredBusLines.includes(busLine))
        return;
      if (busIDs.includes(busID)) return;
      busIDs.push(busID);
      const title = `Bus Line: ${busLine}; \nVehicle ID: ${busID}; \nSpeed: ${speed} km/h; \nDate: ${new Date(
        parseInt(datahora)
      ).toLocaleString('pt-BR')}`;
      return (
        <Marker
          icon={busIcon}
          key={busID}
          position={[
            Number(latitude.replace(',', '.')),
            Number(longitude.replace(',', '.')),
          ]}
          title={title}
        >
          <Popup>
            Bus Line: {busLine}; <br />
            Vehicle ID: {busID}; <br />
            Speed: {speed} km/h; <br />
            Date: {new Date(parseInt(datahora)).toLocaleString('pt-BR')}
          </Popup>
        </Marker>
      );
    }
  );

  const drawPerimeters = () => {
    // Draw a perimeter around each markercluster
    if (!map) return;
    setTimeout(() => {
      // Wait 0.5s until markers are loaded on the map
      map.target.removeLayer(perimeters);
      perimeters = new L.layerGroup();
      map.target.eachLayer((layer) => {
        if (layer instanceof L.MarkerCluster && layer.getChildCount() > 2) {
          // Perimeters colors should match markerclusters colors
          let clusterColor = '#b5e28c99';
          if (layer.getChildCount() > 9) clusterColor = '#f1d35799';
          if (layer.getChildCount() > 99) clusterColor = '#fd9c7399';
          let coords = layer.getConvexHull();
          // To close the polyline perimeter, the first coord must also be the last
          let firstCoord = layer.getConvexHull()[0];
          coords.push(firstCoord);
          perimeters.addLayer(L.polyline(coords, { color: clusterColor }));
        }
      });
      perimeters.addTo(map.target);
    }, 500);
  };
  drawPerimeters();
  return markers;
}

export default Markers;
