import React, { useState, useRef, useEffect } from "react";
import { Button, OutlinedInput, List, ListItemButton, ListItemIcon, ListItemText, ListItem, Divider } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Mapa from "./Mapa";
import { Image } from "@mui/icons-material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateForward, faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons';


const Buscador = () => {
    const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?"

    const [calle, setCalle] = useState("28");
    const [numero, setNumero] = useState("63");
    const [cargando, setCagado] = useState(false);
    const [repartidor, setRepartidor] = useState("0");
    const [descripcion, setDescripcion] = useState();
    
    const [numeroDePedido, setNumeroDePedido] = useState( JSON.parse(sessionStorage.getItem('numeroDePedido')) || 0 );

    const [listaLugares, setListaLugares] = useState( JSON.parse(sessionStorage.getItem('listaLugares')) || []);

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

    const handleLugar = (lugar ,index) =>{

        let newListaLugares = [...listaLugares]
        newListaLugares[index] = lugar
        
        console.log("newLugar ",newListaLugares)

        setListaLugares(newListaLugares)
    }
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
                    calle:calle,
                    repartidor:repartidor,
                    descripcion:descripcion ? descripcion : "",
                    numeroDePedido: numeroDePedido + 1
                }
                
                setNumeroDePedido(numeroDePedido + 1)

                setListaLugares([...listaLugares,...result])
                setCagado(false);
            })
            .catch((err) => {
                console.log("err: ", err);
                setCagado(false);
            });
        
    };

    const handleCordenadas = (index, newCalle, newNumero) => {
        let query = newNumero + ", " + newCalle + ", La Plata, Partido de La Plata, Buenos Aires, 1900, Argentina"
        console.log("AJSJDJ ", query)
        const parametros = {
            q: query,
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
                result[0] = {...result[0]}
                console.log("Query ", result[0])
                let newListaDeLugares = [...listaLugares]
                newListaDeLugares[index] = {...result[0],
                    calle:newListaDeLugares[index]?.calle,
                    repartidor: newListaDeLugares[index]?.repartidor,
                    descripcion: newListaDeLugares[index]?.descripcion,
                    numeroDePedido: newListaDeLugares[index]?.numeroDePedido
                } 

                setListaLugares(newListaDeLugares)
            })
            .catch((err) => {
                console.log("err: ", err);
            });
        
    };

    useEffect(()=>{
        console.log("listaLugares ",listaLugares)

        // Se guarda la "listaLugares" en el Almacenamiento de session
        sessionStorage.setItem('listaLugares', JSON.stringify(listaLugares));
    },[listaLugares])

    useEffect(()=>{
        sessionStorage.setItem('numeroDePedido', JSON.stringify(numeroDePedido));
    },[numeroDePedido])

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

                {/* Capos */}
                <div className="px-[15px]">
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
                            <option value={0} className=" bg-[#333] py-[8px]">Ninguno</option>
                            <option value={1} className=" bg-[#333] py-[8px]">Repartidor 1</option>
                            <option value={2} className=" bg-[#333] py-[8px]">Repartidor 2</option>
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
                            placeholder="Casa con . . ."
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

                {/* Numero de pedido */}
                <div className=" flex-grow-[1] items-center flex justify-center w-full flex-col my-5 ">

                    <div className=" border-y-2 border-primary w-full flex flex-col items-center justify-center py-5">

                        {/* Titulo */}
                        <p className="w-full text-center py-1  text-primary">Ultimo numero de pedido</p>

                        {/* Numero */}
                        <h1 className="text-[41px] bg-primary w-[70px] h-[70px] rounded-full flex justify-center items-center my-3">{numeroDePedido}</h1>

                    </div>

                </div>
                
                {/* Boton para Resetear */}
                <div className="w-full px-[25px]">
                    <button
                    onClick={()=>{
                        setListaLugares([]);
                        setNumeroDePedido(0)
                    }}
                    title="Resetear pedidos"
                    className="rounded-[5px] bg-danger h-[35px] flex justify-center items-center transition-all mt-5 w-full py-3
                    hover:bg-[#ed6244]">
                        Resetear pedidos
                        <FontAwesomeIcon className="ml-2" icon={faRotateRight}/>
                    </button>

                </div>
            </div>

            {/* Mapa */}
            <Mapa coordenadas={listaLugares} handleLugar={handleLugar} handleCordenadas={handleCordenadas}/>
        </>
    )
}

export default Buscador;

