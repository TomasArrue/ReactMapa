import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Map, CircleMarker } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Mapa = (props) => {
    const { coordenadas, handleLugar, handleCordenadas } = props
    const position = [-34.9214, -57.9545];
    const [mapInstance, setMapInstance] = useState(null);

    const RenderIcons = ({ position, dates, index }) => {        
        const [lugar, setLugar] = useState(dates);
        
        let iconColor = "white";

        if(lugar?.repartidor == "1")iconColor = "primary"
        if(lugar?.repartidor == "2")iconColor = "secondary"

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

            console.log("Actualizado")
            handleLugar(lugar, index)

            if(
                lugar?.address?.house_number != dates?.address?.house_number ||
                lugar?.calle != dates?.calle
            )

            handleCordenadas(index, lugar?.calle, lugar?.address?.house_number)
        }

        function pedidoCompletado(){
            let newLugar = {...lugar}
            newLugar.completado = true
            setLugar(newLugar);
        }

        useEffect(()=>{
            if(dates != lugar && lugar?.completado)actualizarLugar();
        },[lugar])

        // En caso de que el pedido este completado no se renderiza
        if(dates?.completado == true) return (null)
        
        if (!dates?.numeroDePedido) {
            // Si no tiene numeroDePedido, asumimos que es el marcador con ":)"
            // y no lo renderizamos.
            return null;
        }

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
                        className="mt-2 border-[1px] border-solid border-[#333] bg-transparent w-full rounded-[5px] py-[8px] px-[15px] text-[#333]
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

                    <button className="p-2 w-full bg-success_dark text-[15px] mt-3 text-white rounded-[5px]" onClick={pedidoCompletado}>
                        Completado
                    </button>
                </div>
            </Popup>

        </Marker>
        );
    };

    useEffect(() => {
        if (mapInstance) {
            const onClick = (e) => {
                const { lat, lng } = e.latlng;
                console.log("Map clicked at: ", lat, lng);
                // Manejo de clic en el mapa aquí. Puedes actualizar el estado o realizar otras acciones.
            };
    
            // Añade el event listener
            mapInstance.on('click', onClick);
    
            // Limpieza: remueve el event listener cuando el componente se desmonte o la instancia del mapa cambie
            return () => {
                mapInstance.off('click', onClick);
            };
        }
    }, [mapInstance]); // Se ejecuta cuando `mapInstance` cambia

    return(
        <MapContainer 
        onpopupclose={()=>console.log("A")}
            id='mapa'
            center={position}
            zoom={13} 
            whenCreated={setMapInstance}
            maxBounds={[
                [-36.500, -58.500], // Límite inferior izquierdo
                [-34.500, -57.500], // Límite superior derecho
            ]}
        >
            <TileLayer
            url="https://api.maptiler.com/maps/streets-v2-dark/256/{z}/{x}/{y}.png?key=TUMjEvDySBYccbHxxgJN"
            />

            <RenderIcons position={position}/>

            {coordenadas.map((item, index) => {
                return(
                    <RenderIcons key={index} position={[item.lat, item.lon]} dates={item} index={index}/>
                )   

            })}

                
        </MapContainer>
    )
}
export default Mapa;