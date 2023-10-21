async function createMapClustering() {
  L.mapbox.accessToken = 'pk.eyJ1IjoiZ3VzdGF2b3Jpc2EiLCJhIjoiY2xueGt6ejBjMGlwNTJrcmhqbWJobnh5aiJ9.hXeNZsM25VwshXGjSbZ9qA';
  
  let map = L.mapbox.map('map')
    .setView([-22.908333, -43.196388], 10)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
  
  const markers = new L.MarkerClusterGroup();

  async function run() {
    const data = await getBusLocations();
    markers.clearLayers();
    const length = data.length;
    let markedBuses = []
    for (let i = 0; i < length; i++) {
      const bus = data[i];
      if (markedBuses.indexOf(bus.ordem) < 0) {
        markedBuses.push(bus.ordem);
        const title = 'Bus line: ' + bus.linha + '; Plate: ' +  bus.ordem + '; Speed: ' + bus.velocidade + '; Data: ' + Date(bus.datahoraenvio)
        + '; Serv: ' + Date(bus.datahoraservidor) + '; DH: ' + Date(bus.datahora);
        const marker = L.marker(
          new L.LatLng(Number(bus.latitude.replace(',','.')), Number(bus.longitude.replace(',','.'))),
          { icon: L.mapbox.marker.icon({
            'marker-symbol': 'post',
            'marker-color': '0044FF'}),
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
    const url = 'https://dados.mobilidade.rio/gps/sppo?dataInicial=2023-10-21+16:50:00&dataFinal=2023-10-21+17:00:00.'
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