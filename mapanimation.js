
async function createMapClustering() {
  L.mapbox.accessToken = 'pk.eyJ1IjoiZ3VzdGF2b3Jpc2EiLCJhIjoiY2xueGt6ejBjMGlwNTJrcmhqbWJobnh5aiJ9.hXeNZsM25VwshXGjSbZ9qA';
  
  let map = L.mapbox.map('map')
    .setView([-22.908333, -43.196388], 10)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

  const busIcon = L.icon({
    iconUrl: 'bus.png', // bus marker image
    iconSize: [32, 32], // Width and height of the icon
    iconAnchor: [16, 32], // The coordinates of the "tip" of the icon (relative to its top left corner)
    popupAnchor: [0, -32], // The coordinates of the point from which popups will "open", relative to the icon anchor
  });
  
  const markers = new L.MarkerClusterGroup();

  async function run() {
    const data = await getBusLocations();
    markers.clearLayers();
    const length = data.length;
    let plottedBuses = [] // control plotted buses to avoid repetition of buses
    for (let i = 0; i < length; i++) {
      const bus = data[i];
      if (plottedBuses.indexOf(bus.ordem) < 0) {
        plottedBuses.push(bus.ordem);
        const title = 'Bus line: ' + bus.linha + '; Vehicle ID: ' +  bus.ordem + '; Speed: ' + bus.velocidade + ' km/h; Date: ' + Date(bus.datahoraenvio)
        const marker = L.marker(
          new L.LatLng(Number(bus.latitude.replace(',','.')), Number(bus.longitude.replace(',','.'))),
          { icon: busIcon,
            title: title
          });
        marker.bindPopup(title);
        markers.addLayer(marker);
      }
    }
    map.addLayer(markers);
    setTimeout(run,30000);
  }

  // Function to fetch bus locations
  async function getBusLocations() {
    const currentDate = new Date();
    const minutesToSubtract = 5;
    const initialDate = new Date(currentDate.getTime() - 60000 * minutesToSubtract);
    const finalDate   = new Date(currentDate.getTime());
    const formattedInitialDate  = initialDate.getFullYear() + "-" + ("0"+(initialDate.getMonth()+1)).slice(-2) + "-" + 
    ("0" + initialDate.getDate()).slice(-2) + "+" + ("0" + initialDate.getHours()).slice(-2) + ":" + 
    ("0" + initialDate.getMinutes()).slice(-2) + ":00";
    const formattedFinalDate   = finalDate.getFullYear() + "-" + ("0"+(finalDate.getMonth()+1)).slice(-2) + "-" + 
    ("0" + finalDate.getDate()).slice(-2) + "+" + ("0" + finalDate.getHours()).slice(-2) + ":" + 
    ("0" + finalDate.getMinutes()).slice(-2) + ":00";
    const url = `https://dados.mobilidade.rio/gps/sppo?dataInicial=${formattedInitialDate}&dataFinal=${formattedFinalDate}.`
    // const url = 'https://dados.mobilidade.rio/gps/sppo.'
    const response  = await fetch(url);
    const json      = await response.json();
    console.log(response);
    console.log(json);
    return json;
  }

  run();
}

createMapClustering()