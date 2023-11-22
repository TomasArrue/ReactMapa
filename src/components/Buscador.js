// import React from "react";
// import { Button, OutlinedInput, List, ListItemButton, ListItemIcon, InboxIcon, ListItemText, DraftsIcon } from "@mui/material";
// import List from '@mui/material/List';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/Inbox';
// import DraftsIcon from '@mui/icons-material/Drafts';

// const Buscador = () => {

//     const handleListItemClick = (event, index) => {
//         setSelectedIndex(index);
//       };

//     return(
//         <div id='buscador'>
//             <div>
//                 <OutlinedInput >Buscador</OutlinedInput>
//             </div>
//             <div>
//                 <Button variant="contained" color="primary">
//                     Buscar
//                 </Button>
//             </div>
//             <div>
//             <List component="nav" aria-label="main mailbox folders">
//                 <ListItemButton
//                     selected={selectedIndex === 0}
//                     onClick={(event) => handleListItemClick(event, 0)}
//                     >
//                     <ListItemIcon>
//                         <InboxIcon />
//                     </ListItemIcon>
//                     <ListItemText primary="Inbox" />
//                 </ListItemButton>
//                 <ListItemButton
//                     selected={selectedIndex === 1}
//                     onClick={(event) => handleListItemClick(event, 1)}
//                     >
//                     <ListItemIcon>
//                         <DraftsIcon />
//                     </ListItemIcon>
//                     <ListItemText primary="Drafts" />
//                 </ListItemButton>
//             </List>
//             </div>

//         </div>
        
//    )
// }
// export default Buscador;


import React, { useState, useRef, useEffect } from "react";
import { Button, OutlinedInput, List, ListItemButton, ListItemIcon, ListItemText, ListItem, Divider } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';


const Buscador = (props) => {
    const { coordenadas, setCoordenadas } = props;

    const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?"

    const [searchText, setSearchText] = useState("");
    const [calle, setCalle] = useState("");
    const [numero, setNumero] = useState("");

    const [listaLugares, setListaLugares] = useState([]);

    const direccion = numero + ", " + calle + ", La Plata, Partido de La Plata, Buenos Aires, 1900, Argentina";

    const parametros = {
        
        q: '',
        format: 'json',
        addressdetails: 'addressdetails'
    }

    const handleInputChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleCalleChange = (event) => {
        setCalle(event.target.value);
    };

    const handleNumeroChange = (event) => {
        setNumero(event.target.value);
    };

    const busqueda = () => {
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
            .then((response) => response.text())
            .then((result) => {
                console.log(JSON.parse(result));
                setListaLugares(JSON.parse(result));
            })
            .catch((err) => console.log("err: ", err));
        
    };

    const verDestino = (item) => {
        console.log("ver destino");
        setCoordenadas(item);
    }


    // console.log(searchText);

    return (
        <div id='buscador'>
            {/* <div>
                <OutlinedInput 
                    value={searchText} 
                    onChange= {handleInputChange}
                >
                    Buscador
                </OutlinedInput>
            </div> */}
            <div>
                <OutlinedInput 
                    value={calle}
                    onChange={handleCalleChange}
                    placeholder="Calle"
                />
            </div>
            <div>
                <OutlinedInput 
                    value={numero}
                    onChange={handleNumeroChange}
                    placeholder="N°"
                />
            </div>
            <div>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick= {busqueda}
                >
                    Buscar
                </Button>
            </div>
            <div>
                <List component="nav" aria-label="main mailbox folders">
                    {listaLugares.map((item) => {
                        return (
                            <div key={item?.osm_id}>
                                <ListItem onClick={verDestino(item)}>
                                    <ListItemIcon>
                                        <img  src="./icono.png" 
                                            alt="Icono" 
                                            style={{width: 35, height: 35}}/>
                                    </ListItemIcon>
                                    <ListItemText primary={item?.display_name} />
                                </ListItem>
                                <Divider/>
                            </div>
                        )
                    })}
                </List>
            </div>
        </div>
    )
}

export default Buscador;

