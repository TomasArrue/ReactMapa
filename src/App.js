// import React, { useState } from 'react';
// import './App.css';
// import MapView from './components/MapView'
// import AutocompleteInput from './components/AutocompleteInput';
// function App() {
//   const [address, setAddress] = useState('');
//   return (
//     <div id='body'>
//       <MapView/>
//       <AutocompleteInput 
//         address={address}
//         setAddress={setAddress}
//         handleSearch={(address) => console.log(`Buscar: ${address}`)}
//       />
//     </div>
    
//   );
// }

// export default App;

import React, { useState } from 'react';
import './App.css';
import MapView from './components/MapView';
import AutocompleteInput from './components/AutocompleteInput';
import Buscador from './components/Buscador';
import Mapa from './components/Mapa';

function App() {
  // const [address, setAddress] = useState('');

  // const [coordenadas, setCoordenadas] = useState(null);

  const [address, setAddress] = useState(null);

  const handleSearch = (address) => {
    // Lógica para manejar la búsqueda
    console.log(`Buscar: ${address}`);
  };

  console.log(address);
  
  return (
    <div id='body'>
      {/* <MapView />
      <AutocompleteInput
        mapReference={(leafletMap) => {
          // Aquí recibes la referencia del mapa desde AutocompleteInput
          // Puedes almacenarlo o realizar acciones adicionales si es necesario
          // Por ejemplo, podrías mantener una referencia en el estado de App.js
        }}
        setAddress={setAddress}
        handleSearch={handleSearch}
      /> */}

        <Mapa listaLugares={address}></Mapa>

        <Buscador coordenadas={address} setAddress={setAddress}></Buscador>

    </div>
  );
}

export default App;
