import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState, useCallback } from 'react';
import BusLinesFilter from './components/BusLinesFilter.jsx';
import MapComponent from './components/MapComponent.jsx';

function App() {
  const [busLineOptions, setBusLineOptions] = useState([
    { value: '', label: '' },
  ]);
  const [data, setData] = useState([]);
  const [filteredBusLines, setFilteredBusLines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const updateFilteredBusLines = useCallback((newFilteredBusLines) => {
    setFilteredBusLines(newFilteredBusLines);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const busData = await getBusData();
      setData(busData);
      // Get Bus Lines Filter Options
      let busLines = [];
      busData.forEach(({ linha: busLine }) => {
        if (!busLines.includes(busLine)) busLines.push(busLine);
      });
      busLines.sort();
      busLines = busLines.map((busLine) => ({
        value: busLine,
        label: busLine,
      }));
      setBusLineOptions(busLines);
      setIsLoading(false);
    };
    fetchData();
    setInterval(fetchData, 40000);
  }, []);

  return (
    <div className="App">
      <h2 className="title h5 mt-2 mb-0 pb-0">
        <img src="./assets/bus.png" className="bus-icon pb-2" alt="bus icon" />
        Rio de Janeiro Real Time Bus Tracker
      </h2>
      <About />
      <BusLinesFilter
        data={data}
        busLinesOptions={busLineOptions}
        setFilteredBusLines={updateFilteredBusLines}
        filteredBusLines={filteredBusLines}
      />
      {isLoading && <LoadingSpinner />}
      <MapComponent data={data} filteredBusLines={filteredBusLines} />
    </div>
  );
}

function About() {
  return (
    <Accordion className="mx-2 about">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <i className="bi bi-info-circle mx-2"></i>
          About this Web App
        </Accordion.Header>
        <Accordion.Body>
          Where is the bus I need to take? Are there additional buses after this
          super crowded one? Unlike other apps that only provide the frequency
          of a specified bus line (e.g., every 20 minutes), this responsive web
          app allows you to track the real-time location of every bus operated
          by the City Hall in Rio de Janeiro. You can filter the displayed buses
          based on their bus lines. The map features red markers for regions
          with 100 buses or more, yellow markers for regions with 10 to 99
          buses, and green markers for regions with fewer than 10 buses.
          Individual buses are represented by blue bus icons, and clicking on a
          bus icon reveals detailed information such as the bus line, speed, and
          identifier. The application retrieves live bus data from the Rio de
          Janeiro City Hall's API (data.rio).
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

function LoadingSpinner() {
  return (
    <section id="loading" className="loading">
      <div
        className="spinner-border ms-auto spinner mx-2"
        aria-hidden="true"
      ></div>
      <strong role="status" className="my-auto">
        Loading...
      </strong>
    </section>
  );
}

async function getBusData() {
  const currentDate = new Date();
  const minutesToSubtract = 5;
  const initialDate = new Date(
    currentDate.getTime() - 60000 * minutesToSubtract
  );
  const finalDate = new Date(currentDate.getTime());
  const formattedInitialDate =
    initialDate.getFullYear() +
    '-' +
    ('0' + (initialDate.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + initialDate.getDate()).slice(-2) +
    '+' +
    ('0' + initialDate.getHours()).slice(-2) +
    ':' +
    ('0' + initialDate.getMinutes()).slice(-2) +
    ':00';
  const formattedFinalDate =
    finalDate.getFullYear() +
    '-' +
    ('0' + (finalDate.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + finalDate.getDate()).slice(-2) +
    '+' +
    ('0' + finalDate.getHours()).slice(-2) +
    ':' +
    ('0' + finalDate.getMinutes()).slice(-2) +
    ':00';
  const url = `https://dados.mobilidade.rio/gps/sppo?dataInicial=${formattedInitialDate}&dataFinal=${formattedFinalDate}.`;
  const response = await fetch(url);
  const busData = await response.json();
  console.log(busData);
  return busData;
}

export default App;
