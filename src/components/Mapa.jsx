import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Map, CircleMarker } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Mapa = (props) => {
    const { coordenadas, handleLugar } = props
    const position = [-34.9214, -57.9545];
    

    const RenderIcons = ({ position, dates, index }) => {        
        const [lugar, setLugar] = useState(dates);

        let iconColor = "white";

        if(lugar?.repartidor == "1")iconColor = "primary"
        if(lugar?.repartidor == "2")iconColor = "danger"


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
        
        function actualizarLugar(){

            
            handleLugar(lugar, index)
        }

        return (
        <Marker
            ref={markerRef}
            position={position}
            icon={L.divIcon({
                html: `
                <div class="relative">
                    <img class="w-[30px] h-[30px]" src="./map-point/point-${iconColor}.png" />
                    <span class="bg-${iconColor} text-white p-2 rounded-full flex w-5 h-5 justify-center items-center absolute top-[-15px] left-[-10px]">
                        ${95}
                    </span>
                </div>`,

                iconSize: [30, 30],
                iconAnchor: [15, 15],
                className: 'custom-icon',
            })}
            eventHandlers={eventHandlers}
        >
            <Popup>
                <div className="flex flex-col">
                    {/* Numero de Casa */}
                    <input
                    type="text"
                    className="py-1 px-2 my-2"
                    value={lugar?.address?.house_number}
                    onChange={(e)=>{setLugar(lugar =>{
                            let newLugar = {...lugar}
                            newLugar.address = {...lugar.address, house_number: e.target.value}
                            return newLugar
                        });
                    }}/>

                    {/* Calle */}
                    <input
                    type="text"
                    className="py-1 px-2 my-2"
                    value={lugar?.address?.road}
                    onChange={(e)=>{setLugar(lugar =>{
                            let newLugar = {...lugar}
                            newLugar.address = {...lugar.address, road: e.target.value}
                            return newLugar
                        });
                    }}/>

                    {/* Repartidor */}
                    <select
                    className="py-1 px-2 my-2"
                    value={lugar?.repartidor}
                    onChange={(e)=>{setLugar(lugar =>{ return{...lugar, repartidor: e.target.value} });}}>
                        <option value={1}>Repartidor 1</option>
                        <option value={2}>Repartidor 2</option>
                    </select>

                    <textarea
                    className="py-1 px-2 my-2"
                    value={lugar?.descripcion}
                    onChange={(e)=>{setLugar(lugar =>{ return{...lugar, descripcion: e.target.value} });}}
                    />

                    {/* Botones */}
                    <div className={`transition-all overflow-hidden flex flex-col justify-evenly ${lugar != dates ? "h-[80px]" : "h-0"}`}>
                        <button onClick={actualizarLugar} className="bg-primary text-white px-[52px] py-[5px] rounded-[5px] w-full">Guardar cambios</button>
                        <button onClick={()=>setLugar(dates)} className="bg-danger text-white px-[52px] py-[5px] rounded-[5px] w-full">Descartar cambios</button>
                    </div>
                </div>
            </Popup>

        </Marker>
        );
    };

    return(
        <MapContainer 
        onpopupclose={()=>console.log("A")}
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
                    <RenderIcons key={index} position={[item.lat, item?.lon]} dates={item} index={index}/>
                )

            })}
                
                
        </MapContainer>
    )
}
export default Mapa;