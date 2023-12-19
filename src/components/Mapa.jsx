import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Map, CircleMarker } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Mapa = (props) => {
    const { coordenadas, handleLugar, handleCordenadas } = props
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

            if(
                lugar?.address?.house_number != dates?.address?.house_number ||
                lugar?.calle != dates?.calle
            )

            handleCordenadas(index, lugar?.calle, lugar?.address?.house_number)
        }

        useEffect(()=>{
            
        },[])

        // En caso de que el pedido este completado no se renderiza
        if(dates?.repartidor == "-1") return (null)

        return (
        <Marker
            ref={markerRef}
            position={position}
            icon={L.divIcon({
                html: `
                <div class="relative">
                    <img class="w-[30px] h-[30px]" src="./map-point/point-${iconColor}.png" />

                    <span
                    class="${iconColor == "white" ? "bg-white text-[#333]" : `bg-${iconColor} text-white`} p-[10px] rounded-[5px] flex h-5 justify-center items-center absolute top-[0] w-full font-semibold">
                        ${lugar?.numeroDePedido ? lugar?.numeroDePedido : ":)"}
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
                    
                    {/* Calle */}
                    <div>
                        <label className=" font-semibold">
                            Calle
                        </label>

                        <input
                        type="text"
                        className="my-2 border-[1px] border-solid border-[#333] bg-transparent w-full rounded-[5px] mb-4 py-[8px] px-[15px] text-[#333]
                        focus:outline-none focus:border-primary"
                        value={lugar?.calle}
                        onChange={(e)=>{setLugar(lugar =>{
                                let newLugar = {...lugar}
                                newLugar = {...lugar, calle: e.target.value}
                                return newLugar
                            });
                        }}/>
                    </div>

                    {/* Numero de Casa */}
                    <div>
                        <label className=" font-semibold">
                            Numero de Casa
                        </label>

                        <input
                        type="text"
                        className="my-2 border-[1px] border-solid border-[#333] bg-transparent w-full rounded-[5px] mb-4 py-[8px] px-[15px] text-[#333]
                        focus:outline-none focus:border-primary"
                        value={lugar?.address?.house_number}
                        onChange={(e)=>{setLugar(lugar =>{
                                let newLugar = {...lugar}
                                newLugar.address = {...lugar.address, house_number: e.target.value}
                                return newLugar
                            });
                        }}/>
                    </div>

                    {/* Repartidor */}
                    <div>
                        <label className=" font-semibold">
                            Repartidor
                        </label>

                        <select
                        className="my-2 border-[1px] border-solid border-[#333] bg-transparent w-full rounded-[5px] mb-4 py-[8px] px-[15px] text-[#333]
                        focus:outline-none focus:border-primary"
                        value={lugar?.repartidor}
                        onChange={(e)=>{setLugar(lugar =>{ return{...lugar, repartidor: e.target.value} });}}>
                            <option value={-1}>Completado</option>
                            <option value={0}>Ninguno</option>
                            <option value={1}>Repartidor 1</option>
                            <option value={2}>Repartidor 2</option>
                        </select>
                    </div>

                    {/* Descripcion */}
                    <div>
                        <label className=" font-semibold">
                            Descripción
                        </label>

                        <textarea
                        className="my-2 border-[1px] border-solid border-[#333] bg-transparent w-full rounded-[5px] mb-4 py-[8px] px-[15px] text-[#333]
                        focus:outline-none focus:border-primary"
                        value={lugar?.descripcion}
                        onChange={(e)=>{setLugar(lugar =>{ return{...lugar, descripcion: e.target.value} });}}
                        />
                    </div>

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