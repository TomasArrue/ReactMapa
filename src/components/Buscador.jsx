import React, { useState, useRef, useEffect } from "react";
import { Button, OutlinedInput, List, ListItemButton, ListItemIcon, ListItemText, ListItem, Divider } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Mapa from "./Mapa";
import { Image } from "@mui/icons-material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


const Buscador = () => {
    const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?"

    const [calle, setCalle] = useState("28");
    const [numero, setNumero] = useState("63");
    const [cargando, setCagado] = useState(false);
    const [repartidor, setRepartidor] = useState("Repartidor 1");
    const [descripcion, setDescripcion] = useState();

    const [listaLugares, setListaLugares] = useState([]);

    const direccion = numero + ", " + calle + ", La Plata, Partido de La Plata, Buenos Aires, 1900, Argentina";

    const parametros = {
        
        q: '',
        format: 'json',
        addressdetails: 'addressdetails'
    }

    //#region Handlers
    const handleCalleChange = (event) => {
        setCalle(event.target.value);
    };

    const handleNumeroChange = (event) => {
        setNumero(event.target.value);
    };
 
    const handleRepartidor = (event) => {
        setRepartidor(event.target.value);
    };
    
    const handleDescripcion = (event) => {
        setDescripcion(event.target.value);
    };
    //#endregion

    const busqueda = () => {
        setCagado(true);

        const parametros = {
            q: numero + ", " + calle + ", La Plata, Partido de La Plata, Buenos Aires, 1900, Argentina",
            format: 'json',
            addressdetails: 1,
            polygon_geojson: 0,
            limit: 1
        };
        const queryString = new URLSearchParams(parametros).toString();
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                result[0] = {...result[0],
                    repartidor:repartidor,
                    descripcion:descripcion
                }
                setListaLugares([...listaLugares,...result])
                setCagado(false);
            })
            .catch((err) => {
                console.log("err: ", err);
                setCagado(false);
            });
        
    };

    useEffect(()=>{
        console.log("listaLugares ",listaLugares)
    },[listaLugares])

    const eliminar = (id) =>{
        let newListaLugares = listaLugares;

        newListaLugares.filter((lugar) =>{
            if(lugar.osm_id != id) return lugar;
            else console.log(lugar)
        })

        console.log("ID ", id)
        console.log("ELIMINAR ", newListaLugares)
        setListaLugares(newListaLugares)
    }
    

    return (
        <>
            {/* Buscador */}
            <div id='buscador'>

                {/* Logo */}
                <div className="mx-auto mb-8">
                    <h2 className=" italic text-[21px] font-bold text-primary" style={{lineHeight:"12px"}}>BLENDS</h2>
                    <h2 className=" italic text-[16px] font-bold">BURGER</h2>
                </div>

                {/* Calle */}
                <div className="field">

                    <label>
                        Calle
                    </label>

                    <input
                        type="text" 
                        className="input"
                        value={calle}
                        onChange={handleCalleChange}
                        placeholder="Calle"
                    />
                </div>

                {/* Numero de Casa */}
                <div className="field">

                    <label>
                        Numero de casa
                    </label>

                    <input
                        type="text" 
                        className="input"
                        value={numero}
                        onChange={handleNumeroChange}
                        placeholder="N°"
                    />
                </div>

                {/* Repartidor */}
                <div className="field">

                    <label>
                        Repartidor
                    </label>

                    <select
                    onChange={handleRepartidor}
                    value={repartidor}
                    className="border-[1px] border-solid border-white bg-transparent w-full rounded-[5px] mb-4 py-[8px] px-[15px]
                    focus:outline-none focus:border-primary">
                        <option className=" bg-[#333] py-[8px]">Repartidor 1</option>
                        <option className=" bg-[#333] py-[8px]">Repartidor 2</option>
                        {/* <option className=" bg-[#333] py-[8px]">Completado</option> */}
                    </select>
                </div>

                {/* Descripción */}
                <div className="field">

                    <label>
                        Descripción
                    </label>

                    <textarea
                        type="text" 
                        className="border-[1px] border-solid border-white bg-transparent w-full rounded-[5px] mb-4 py-[8px] px-[15px] min-h-[50px]
                        focus:outline-none focus:border-primary"
                        value={descripcion}
                        onChange={handleDescripcion}
                        placeholder="Casa con ..."
                    />
                </div>

                {/* Boton */}
                <div>
                    <Button 
                    className="btn-buscar"
                        variant="contained"
                        onClick= {busqueda}
                    >
                        {cargando ? <span className="loader"></span> : "Buscar"}
                    </Button>
                </div>
            </div>

            {/* Mapa */}
            <Mapa coordenadas={listaLugares}/>
        </>
    )
}

export default Buscador;

