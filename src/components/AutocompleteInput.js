// // import React, { useState } from 'react';
// // import PlacesAutocomplete, {
// //   geocodeByAddress,
// //   geocodeByPlaceId,
// //   getLatLng,
// // } from 'react-places-autocomplete';

// // const AutocompleteInput = ({ address, setAddress, handleSearch }) => {
// //   const [value, setValue] = useState(address);

// //   const handleSelect = async (address) => {
// //     try {
// //       const results = await geocodeByAddress(address);
// //       const latLng = await getLatLng(results[0]);
// //       setValue(address);
// //       setAddress(address);
// //       handleSearch(latLng);
// //     } catch (error) {
// //       console.error('Error al obtener coordenadas:', error);
// //     }
// //   };

// //   return (
// //     <h1>hola</h1>
// //   );
// // };

// // export default AutocompleteInput;



// import React, { useState, useEffect } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
// import 'leaflet-control-geocoder/dist/Control.Geocoder.js';

// const AutocompleteInput = ({ map, setAddress, handleSearch }) => {
//   useEffect(() => {
//     if (!map) return;

//     // Añadir control de geocodificación al mapa
//     const geocoder = L.Control.geocoder().addTo(map);

//     // Manejar la selección de la ubicación
//     geocoder.on('markgeocode', function (event) {
//       const { name, center } = event.geocode;
//       setAddress(name);
//       handleSearch(center);
//     });

//     // Limpiar el control al desmontar el componente
//     return () => {
//       map.removeControl(geocoder);
//     };
//   }, [map, setAddress, handleSearch]);

//   return <div id='location'></div>;
// };

// export default AutocompleteInput;

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';


const AutocompleteInput = ({ mapReference, setAddress, handleSearch }) => {
  useEffect(() => {
    if (!mapReference) return;

    // Añadir control de geocodificación al mapa
    const geocoder = L.Control.geocoder().addTo(mapReference);

    // Manejar la selección de la ubicación
    geocoder.on('markgeocode', function (event) {
      const { name, center } = event.geocode;
      setAddress(name);
      handleSearch(center);
    });

    // Limpiar el control al desmontar el componente
    return () => {
      mapReference.removeControl(geocoder);
    };
  }, [mapReference, setAddress, handleSearch]);

  return <div id='location'></div>;
};

export default AutocompleteInput;
