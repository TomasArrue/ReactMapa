import React, { useState, useRef, useEffect } from "react";
import { Button, OutlinedInput, List, ListItemButton, ListItemIcon, ListItemText, ListItem, Divider } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Mapa from "./Mapa";
import { Image } from "@mui/icons-material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faRotateForward, faRotateRight, faTrash, faTruck, faTruckFast, faLocationDot } from '@fortawesome/free-solid-svg-icons';


const Buscador = () => {
    const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?"

    const [repartidores, setRepartidores] = useState([

    ])

    const [calle, setCalle] = useState("");
    const [numero, setNumero] = useState("");
    const [cargando, setCagado] = useState(false);
    const [repartidor, setRepartidor] = useState("0");
    const [descripcion, setDescripcion] = useState();
    const [manualMode, setManualMode] = useState(false)
     
    const [numeroDePedido, setNumeroDePedido] = useState( JSON.parse(sessionStorage.getItem('numeroDePedido')) || 0 );

    const [listaLugares, setListaLugares] = useState( JSON.parse(sessionStorage.getItem('listaLugares')) || []);

    const [menuOpen, setMenuOpen] = useState(true);

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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            busqueda();
        }
    };
    //#endregion


    const busqueda = () => {
        const match = calle.match(/([a-zA-Z\s]+)(\d+)$/);
        let calleCorregida = calle;

        if (match) {
            const parteCaracteres = match[1].trim();
            const parteNumeros = match[2];
            calleCorregida = `${parteCaracteres} ${parteNumeros}`;
        }

        setCagado(true);

        const parametros = {
            q: numero + ", " + calleCorregida + ", La Plata, Partido de La Plata, Buenos Aires, 1900, Argentina",
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
                    typeDeliberi:"auto",
                    completado: false,
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

        if(listaLugares[index]?.typeDeliberi == "auto"){

            let query = newNumero + ", " + newCalle + ", La Plata, Partido de La Plata, Buenos Aires, 1900, Argentina"
    
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
                        numeroDePedido: newListaDeLugares[index]?.numeroDePedido,
                        typeDeliberi:"auto"
                    } 
    
                    setListaLugares(newListaDeLugares)
                })
                .catch((err) => {
                    console.log("err: ", err);
                });
        }
    };
    
    useEffect(()=>{
        console.log("listaLugares ",listaLugares)

        // Se guarda la "listaLugares" en el Almacenamiento de session
        sessionStorage.setItem('listaLugares', JSON.stringify(listaLugares));
    },[listaLugares])

    useEffect(()=>{
        sessionStorage.setItem('numeroDePedido', JSON.stringify(numeroDePedido));
    },[numeroDePedido])

    const addLugar = (lat, lon) =>{ 
        let newListaDeLugares = [...listaLugares]

        newListaDeLugares.push({
            typeDeliberi:"manual",
            lat: lat,
            lon: lon,
            completado: false,
            calle:calle,
            repartidor:repartidor,
            descripcion:descripcion ? descripcion : "",
            numeroDePedido: numeroDePedido + 1,
            address:{
                house_number: numero
            }
        })

        setNumeroDePedido(numeroDePedido + 1)

        setListaLugares(newListaDeLugares)
    }

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

    // Puntero Manual
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const offset = 15;
    
    

    return (
        <div
        onMouseMove={(event) => manualMode && setMousePosition({ x: event.clientX, y: event.clientY })} >
            
            <div className={`fixed z-20 transition-all ${!menuOpen ? "left-[-406px]" : "left-0"} `}>

                {/* Botton para cerrar/abrir menu */}
                <div onClick={()=>setMenuOpen(!menuOpen)} className="absolute left-full bg-[#333] text-white bottom-1/2 translate-y-[50%] px-3 py-4 rounded-[0_7px_7px_0] cursor-pointer shadow-[2px_2px_5px_#0006]">
                    <FontAwesomeIcon icon={!menuOpen ? faCaretRight : faCaretLeft}/>
                </div>

                {/* Buscador */}
                <div id='buscador'>

                    {/* Capos */}
                    <div className="px-[15px] z-30">
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
                                onKeyDown={handleKeyDown}
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
                                onKeyDown={handleKeyDown}
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
                        <div
                        className="flex">

                            <Button 
                            className="btn-buscar flex-grow-[1]"
                                variant="contained"
                                onClick= {busqueda}
                            >
                                {cargando ? <span className="loader"></span> : "Buscar"}
                            </Button>
                            
                            <button 
                            className={`w-[36px] text-[21px] ml-2 rounded-[5px] ${manualMode ? "bg-danger ": "border-2 border-danger text-danger"} transition-all`}
                                variant="contained"
                                onClick={(event)=>{
                                    setManualMode(!manualMode)
                                    setMousePosition({ x: event.clientX, y: event.clientY })
                                }}
                            >
                                <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>
                                {/* Manual */}
                            </button>

                        </div>
                    </div>

                    {/* Numero de pedido */}
                    <div className=" flex-grow-[1] items-center flex justify-center w-full flex-col my-5  z-30">

                        <div className=" border-t-2 border-[#fff4] w-full flex flex-col items-center justify-center py-5">

                            {/* Titulo */}
                            {/* <div className="w-full px-[15px] py-1 text-[18px] flex justify-between items-center mb-4">
                                Cantidad de pedidos asignados <FontAwesomeIcon icon={faTruck}/>
                            </div> */}

                            {/* Repartodores */}
                            <div className="px-[15px] w-full">
                                <div className="py-3 w-full flex justify-between px-2 transition-all
                                hover:bg-[#fff1]">
                                    <span className=" text-primary">Repartidor 1</span>
                                    <p>{listaLugares?.filter(lugar=>lugar?.repartidor == "1")?.length}<FontAwesomeIcon className="ml-3 opacity-70" icon={faTruckFast}/></p>
                                </div>
                                <div className="border-t-2 border-[#fff4] py-3 w-full flex justify-between px-2 transition-all
                                hover:bg-[#fff1]">
                                    <span className=" text-secondary">Repartidor 2</span> 
                                    <p>{listaLugares?.filter(lugar=>lugar?.repartidor == "2")?.length}<FontAwesomeIcon className="ml-3 opacity-70" icon={faTruckFast}/></p>
                                </div>
                            </div>

                            {/* Numero */}
                            {/* <h1 className="text-[41px] bg-primary w-[70px] h-[70px] rounded-full flex justify-center items-center my-3">{numeroDePedido}</h1> */}

                        </div>

                    </div>
                    
                    {/* Boton para Resetear */}
                    <div className="w-full px-[25px] z-30">
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
                    
                    {/* Logo */}
                    <div className="mx-auto mb-8 absolute opacity-10 w-full h-full flex justify-center items-center">
                        <div>
                            <h2 className="text-border italic text-[51px] font-bold text-[#111]" style={{lineHeight:"12px"}}>BLENDS</h2>
                            <h2 className="text-border italic text-[46px] font-bold text-[#111]">BURGER</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Punto de mapa */}
            {
                manualMode &&
                <div
                className=" pointer-events-none"
                    style={{
                    position: 'absolute',
                    left: mousePosition.x - offset,
                    top: mousePosition.y - offset,
                    backgroundColor: 'red',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    zIndex:"90"
                    }}
                >
                    <div className="relative w-fit">                    
                        <FontAwesomeIcon
                        className={`
                        ${repartidor == "1" && "text-primary"}
                        ${repartidor == "2" && "text-secondary"}  
                        ${repartidor != "1" && repartidor != "2" && "text-white"}  
                        text-[30px] w-[30px]`}
                        icon={faLocationDot}/>

                        {/* <span class="bg-secondary p-[10px] rounded-[5px] flex h-5 justify-center items-center absolute top-[0] w-full font-semibold">
                        </span> */}

                        <span
                        className={`
                        ${repartidor == "1" && "bg-primary text-white"}
                        ${repartidor == "2" && "bg-secondary text-white"}  
                        ${repartidor != "1" && repartidor != "2" && "bg-white text-[#333]"}  
                        p-[10px] rounded-[5px] flex h-5 justify-center items-center absolute top-[0] w-full font-semibold text-[12px]`}>
                            {numeroDePedido + 1}
                        </span>
                    </div>
                </div>
            }

            {/* Mapa */}
            <Mapa
            coordenadas={listaLugares}
            handleLugar={handleLugar}
            handleCordenadas={handleCordenadas}
            addLugar={addLugar}
            manualMode={manualMode}
            handleManualMode={(value)=>setManualMode(value)}
            />
        </div>
    )
}

export default Buscador;

