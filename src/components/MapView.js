import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css'; // Si estás usando marker clusters
import { Icon } from 'leaflet';


const MapView = () => {
  // Estado para almacenar las ubicaciones de los marcadores
  const [locations, setLocations] = useState([]);
  const [addressInput, setAddressInput] = useState('');  // Agregado: estado para la entrada de dirección

  const defaultIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const handleSearch = async (address) => {
    const provider = new OpenStreetMapProvider();
    const postalCode = 1900
    try {
      const results = await provider.search({ query: address, postalCode});

      if (results.length > 0) {
        console.log("direccion encontrada: " + address)
        const { x, y } = results[0];
        setLocations([...locations, { lat: y, lng: x }]);
      }
    } catch (error) {
      console.error('Error al buscar la dirección:', error);
    }
  };


  // Agregado: función para agregar una ubicación desde la entrada de dirección
  const addLocation = () => {
    handleSearch(addressInput);
    setAddressInput(''); // Limpiar el cuadro de entrada después de agregar la ubicación
  };

  return (
    <MapContainer id='mapa'
      center={[-34.9214, -57.9545]}
      zoom={14}
      maxBounds={[
        [-34.995, -58.051], // Límite inferior izquierdo
        [-34.864, -57.848], // Límite superior derecho
      ]}
    >
      {/* Capa de azulejos que representa el mapa base */}
      {/* Modo Diurno */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Representación de los marcadores en el mapa */}
      {locations.map((location, index) => (
        <Marker 
          key={index} 
          position={[location?.lat || 0, location?.lng || 0]}
          icon={defaultIcon}
        >
          {/* Popup que se muestra al hacer clic en el marcador */}
          <Popup>{`Marker ${index + 1}`}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
