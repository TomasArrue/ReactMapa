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

    const [listaLugares, setListaLugares] = useState([]);

    const direccion = numero + ", " + calle + ", La Plata, Partido de La Plata, Buenos Aires, 1900, Argentina";

    const parametros = {
        
        q: '',
        format: 'json',
        addressdetails: 'addressdetails'
    }

    const handleCalleChange = (event) => {
        setCalle(event.target.value);
    };

    const handleNumeroChange = (event) => {
        setNumero(event.target.value);
    };

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

                setListaLugares([...listaLugares,...result])
                setCagado(false);
            })
            .catch((err) => {
                console.log("err: ", err);
                setCagado(false);
            });
        
    };

    const verDestino = (item) => {
        console.log("ver destino");
    }

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
            <div id='buscador'>
                <div>
                    <OutlinedInput 
                        className="input"
                        value={calle}
                        onChange={handleCalleChange}
                        placeholder="Calle"
                    />
                </div>
                <div>
                    <OutlinedInput 
                        className="input"
                        value={numero}
                        onChange={handleNumeroChange}
                        placeholder="N°"
                    />
                </div>
                <div>
                    <Button 
                    className="btn-buscar"
                        variant="contained"
                        onClick= {busqueda}
                    >
                        {cargando ? <span className="loader"></span> : "Buscar"}
                    </Button>
                </div>
                <div>
                    
                    {listaLugares.length > 0 &&
                    <List component="nav" aria-label="main mailbox folders">
                        {listaLugares.map((item) => {
                            return (
                                <div key={item?.osm_id}>
                                    <ListItem >
                                        <ListItemIcon>
                                            <img  src="./icono.png" 
                                                alt="Icono" 
                                                style={{width: 35, height: 35}}/>
                                        </ListItemIcon>
                                        <ListItemText primary={item?.display_name} />
                                        <FontAwesomeIcon 
                                            icon={faTrash}
                                            onClick={()=>{
                                                setListaLugares(listaLugares=>{
                                                    
                                                    return listaLugares.filter((lugar) =>{
                                                        if(lugar.osm_id != item?.osm_id) return lugar;
                                                        else console.log(lugar)
                                                    })
                                                })
                                            }} 
                                        />
                                    </ListItem>
                                    <Divider/>
                                </div>
                            )
                        })}
                    </List>
                    }
                </div>
            </div>

            <Mapa coordenadas={listaLugares}/>
        </>
    )
}

export default Buscador;

