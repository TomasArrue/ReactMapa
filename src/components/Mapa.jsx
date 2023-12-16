import React, { useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const pointWhite = L.icon({
    iconUrl: "./map-point/point-white.png",
    iconSize: [30, 30]
})

const pointPrimary = L.icon({
    iconUrl: "./map-point/point-primary.png",
    iconSize: [30, 30]
})

const pointDanger = L.icon({
    iconUrl: "./map-point/point-danger.png",
    iconSize: [30, 30]
})


const Mapa = (props) => {
    const { coordenadas } = props

    // if (!coordenadas || !coordenadas.lat || !coordenadas.lon) {
    //     return null; // o cualquier otra lógica que desees para manejar el caso cuando las coordenadas no están definidas
    // }

    // const listaLugares = [coordenadas?.lat, coordenadas?.lon]

    // La Plata

    const position = [-34.9214, -57.9545];
    
    const RenderIcons = ({ position, dates }) => {

        let icon = pointWhite;

        if(dates?.repartidor == "Repartidor 1")icon = pointPrimary
        if(dates?.repartidor == "Repartidor 2")icon = pointDanger

        const markerRef = useRef();
    
        const eventHandlers = useMemo(
        () => ({
            mouseover() {
            },
            mouseout() {
                // cierra el Pop Up
                // if (markerRef) markerRef.current.closePopup();
            },
            click() {
                if (markerRef) markerRef.current.openPopup();
                // alert('Fue Cliqueado!');
            },
        }),
        []
        );
    
        return (
        <Marker
            ref={markerRef}
            position={position}
            icon={icon}
            eventHandlers={eventHandlers}
        >
            <Popup>
                <div>
                    <p>N ° {dates?.address?.house_number}</p>
                    <p>{dates?.address?.road}</p>
                    <p>{dates?.repartidor}</p>
                    <p>{dates?.descripcion}</p>
                    <button className="bg-primary text-white px-[52px] py-[5px] rounded-[5px]">Completado</button>
                </div>
            </Popup>

        </Marker>
        );
    };

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
                <RenderIcons position={position}/>

                {coordenadas.map((item, index) => {
                    return(
                        <RenderIcons position={[item.lat, item?.lon]} dates={item}/>
                    )

                })}
                
                
        </MapContainer>
    )
}
export default Mapa;