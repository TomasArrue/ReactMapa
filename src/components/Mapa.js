import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = L.icon({
    iconUrl: "./icono.png",
    iconSize: [30, 30]
})


const Mapa = (props) => {
    const { coordenadas } = props

    if (!coordenadas || !coordenadas.lat || !coordenadas.lon) {
        return null; // o cualquier otra lógica que desees para manejar el caso cuando las coordenadas no están definidas
    }

    const listaLugares = [coordenadas?.lat, coordenadas?.lon]

    // La Plata
    const position = coordenadas
        ? [coordenadas.lat, coordenadas.lon]
        : [-34.9214, -57.9545];
    return(
        <MapContainer 
            id='mapa'
            center={position} 
            zoom={14} 
            maxBounds={[
                [-34.995, -58.051], // Límite inferior izquierdo
                [-34.864, -57.848], // Límite superior derecho
            ]}
        >
            <TileLayer
            url="https://api.maptiler.com/maps/streets-v2-dark/256/{z}/{x}/{y}.png?key=TUMjEvDySBYccbHxxgJN"
            />
            {listaLugares &&(
                <Marker position={[coordenadas.lat, coordenadas.lon]} icon={icon}></Marker>
            )}
        </MapContainer>
    )
}
export default Mapa;