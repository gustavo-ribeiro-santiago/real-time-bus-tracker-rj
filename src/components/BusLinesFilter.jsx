import Select from 'react-select';
import { useState, useEffect, useCallback } from 'react';

function BusLinesFilter({ data, busLinesOptions, setFilteredBusLines, filteredBusLines }) {
  const [placeholder, setPlaceholder] = useState("Filter by Bus Lines");
  const [busesQty, setBusesQty] = useState("0");

  useEffect(() => {
    // Placeholder text depends on screen width
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setPlaceholder("Filter by Bus Lines");
      } else {
        setPlaceholder("All");
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const calculateBusesQty = () => {
      // Count distinct buses (data may contain repeated buses)
      let busIDs = [];
      data.forEach(({ linha: busLine, ordem: busID }) => {
        if (filteredBusLines.length && !filteredBusLines.includes(busLine)) return;
        if (!busIDs.includes(busID)) busIDs.push(busID);
      });
      setBusesQty(busIDs.length.toLocaleString('en'));
    }
    calculateBusesQty();
  }, [data, filteredBusLines]);
  
  const applyFilter = useCallback((event) => {
    let filteredValues = event.map(({ value }) => value);
    setFilteredBusLines(filteredValues);
  }, []);

  return (
    <section className="filter d-flex mx-2 border solid rounded">
      <i className="bi bi-bus-front my-auto mx-1"></i>
      <p id="busesQty" className="buses-qty fw-bold my-auto ms-1 me-2">
        {busesQty} buses
      </p>
      <i className="hide-on-mobile filter-icon bi bi-funnel my-auto"></i>
      <p className="hide-on-mobile my-auto ms-2 mx-2">Filter by Bus Lines:</p>
      <Select
        placeholder={placeholder}
        isMulti
        options={busLinesOptions}
        className="basic-multi-select my-auto"
        classNamePrefix="select"
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, minWidth: '20%' }),
        }}
        onChange={applyFilter}
      />
    </section>
  );
}

export default BusLinesFilter;