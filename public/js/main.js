
import Mapa from './mapa.js';
import StarRating from './starRating.js';

const eventoCargarMasFallas = (fallasFiltradas) => {
    document.querySelector('.btnVerMas').style.display = 'block';
    document.querySelector('.btnVerMas').onclick = () => {
        cargarFallas(fallasFiltradas);
    }
}

const eventoBusqueda = () => {
    document.querySelector('.buscadorFalla').onchange = filtrarFallas;
}

const abrirUbicacion = (btn) => {

    let idFalla = btn.getAttribute('idFalla');
    let falla   = mapFallas.get(idFalla);

    mapa.modificarCoordenadas(falla.geometry.coordinates, falla.properties);

    let contenedorMapa = document.querySelector('#contenedorMapa');

    mostrarMapa(contenedorMapa);

    // Eliminar la propagacion de eventos desde el mapa
    document.querySelector('#myMap').onclick = (e) => e.stopPropagation();

    // Mostrar el mapa cuando se haga click sobre el btn Ubicacion
    contenedorMapa.onclick = () => esconderMapa(contenedorMapa);

    contenedorMapa.onkeydown = (e) => {
        if (e.key === 'Escape') {
            esconderMapa(contenedorMapa);
        }
    }

}

const mostrarMapa = (contenedorMapa) => {
    contenedorMapa.style.zIndex = 20;
    contenedorMapa.style.opacity = 1;
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = 'no';
}

const esconderMapa = async (contenedorMapa) => {
    document.documentElement.style.overflow = 'auto';
    document.body.scroll = 'yes';
    contenedorMapa.style.opacity = 0;
    await new Promise(resolve => contenedorMapa.addEventListener('transitionend', resolve))
    contenedorMapa.style.zIndex = -1;
}

const eventoTipoFalla = () => {

    const radioFallaPrincipal = document.querySelector('.radioFallaPrincipal');
    const radioFallaInfantil = document.querySelector('.radioFallaInfantil');

    radioFallaPrincipal.onchange = filtrarFallas;
    radioFallaInfantil.onchange = filtrarFallas;
}

const insertarFalla = (nombreFalla, srcFoto, anyoFundada, tipoFalla, artista, id) => {
    return `
        <div class="falla">
            <p class="nombreFalla">${nombreFalla}</p>
            <img class="fotoFalla" src="${srcFoto}" alt="Foto de la falla ${nombreFalla}">
            <p>${artista}</p>
            <p>Año fundada: ${anyoFundada}</p>
            <p>Falla ${tipoFalla}</p>
            <button idfalla="${id}" title="Ver la ubicación de la falla" class="btnUbicacion">Ubicación</button>
            ${starRating.getHTML(id)}
        </div>`;
}

// Obtener los años de la primera y la ultima falla creada
const getMinAndMaxYear = () => {

    let minYear = 3000;
    let maxYear = -1;
    let year;

    fallas.map(falla => {
        year = parseInt(falla.anyo_fundacion);
        if (year) {
            minYear = Math.min(year, minYear);
            maxYear = Math.max(year, maxYear);
        }
    });

    return { minYear, maxYear };
}

const esconderBotonVerMas = () => {
    document.querySelector('.btnVerMas').style.display = 'none';
}

const generarHtmlFallas = (fallasFiltradas, radioFallaPrincipal, radioFallaInfantil) => {

    let contenedor = '';
    
    let index = limiteFallasCargadas;
    limiteFallasCargadas += 20;

    for (let falla of fallasFiltradas) {

        if (radioFallaPrincipal.checked) {
            let artista = (falla.artista.length != 0) ? `Artista: ${falla.artista}` : 'Artista desconocido';
            contenedor += insertarFalla(falla.nombre, falla.boceto, falla.anyo_fundacion, 'PRINCIPAL', artista, falla.id);
        }

        if (radioFallaInfantil.checked) {
            let artista = (falla.artista_i.length != 0) ? `Artista: ${falla.artista_i}` : 'Artista desconocido';
            contenedor += insertarFalla(falla.nombre, falla.boceto_i, falla.anyo_fundacion_i, 'INFANTIL', artista, falla.id);
        }

        index++;
        if (index == fallasFiltradas.length) {
            esconderBotonVerMas();
            break;
        }
        if (index == limiteFallasCargadas) break;
    }

    fallasFiltradas.splice(0, 20);
    limiteFallasCargadas += 20;

    return contenedor;
}

const insertarComboBoxFundacion = () => {

    let years = getMinAndMaxYear();

    const inputDesde = document.querySelector('.anyoDesde');
    const inputHasta = document.querySelector('.anyoHasta');

    inputDesde.min = years.minYear;
    inputDesde.max = years.maxYear;

    inputHasta.min = years.minYear;
    inputHasta.max = years.maxYear;

    inputDesde.onchange = () => {
        inputHasta.min = inputDesde.value;
        filtrarFallas();
    }

    inputHasta.onchange = filtrarFallas;

    inputDesde.placeholder = `Desde ${years.minYear}`;
    inputHasta.placeholder = `Hasta ${years.maxYear}`;
}

const insertarComboBoxRegiones = (regiones) => {

    const comboRegiones = document.querySelector('.comboRegiones');
    let set = new Set();

    regiones.forEach(region => set.add(region));

    // Ordenar las regiones
    set = Array.from(set).sort();

    set.forEach(region => {
        if (region.length != 0) {
            let option = document.createElement('option');
            option.text = option.value = region;
            comboRegiones.add(option);
        }
    })

    comboRegiones.onchange = filtrarFallas;
}

const cargarFallas = (fallasFiltradas) => {

    // Obtener que tipo de falla esta seleccionada
    const radioFallaPrincipal = document.querySelector('.radioFallaPrincipal');
    const radioFallaInfantil = document.querySelector('.radioFallaInfantil');

    // Obtener el html generado con toda la info de las fallas
    let htmlFallas = generarHtmlFallas(fallasFiltradas, radioFallaPrincipal, radioFallaInfantil);

    // Insertar todo el html generado
    document.querySelector('#contenedorFallas').innerHTML += htmlFallas;

    starRating.rellenarPuntuacionesFallas();

    // Aplicar eventos al boton de abrir ubicación
    document.querySelectorAll('.btnUbicacion').forEach(btn => btn.onclick = () => abrirUbicacion(btn));

    // Aplicar eventos a las estrellas, votaciones
    starRating.applyEvents();
}

const filtrarFallas = () => {

    const comboSector = document.querySelector('.comboRegiones');
    let sector = comboSector.options[comboSector.selectedIndex].value;

    let anyoDesde = document.querySelector('.anyoDesde').value;
    let anyoHasta = document.querySelector('.anyoHasta').value;

    let fallaBuscada = document.querySelector('.buscadorFalla').value;
    fallaBuscada = fallaBuscada.toLowerCase();

    let fallasFiltradas = fallas.filter(falla => {
        if (!falla.anyo_fundacion || !falla.sector) return true;
        return ((sector === 'all' || falla.sector === sector) &&
            (!anyoDesde || falla.anyo_fundacion >= anyoDesde) &&
            (!anyoHasta || falla.anyo_fundacion <= anyoHasta) &&
            falla.nombre.toLowerCase().includes(fallaBuscada));
    });

    // Al cargar otro filtro reiniciamos las fallas anteriormente mostradas
    document.querySelector('#contenedorFallas').innerHTML = '';
    limiteFallasCargadas = 0;

    if (fallasFiltradas.length > 0) {

        // Ordenar alfabeticamente por nombre de falla
        fallasFiltradas.sort((falla1, falla2) => falla1.nombre.localeCompare(falla2.nombre));
    
        eventoCargarMasFallas(fallasFiltradas);    
        cargarFallas(fallasFiltradas);
    }

}

const initApplication = (regiones) => {
    insertarComboBoxRegiones(regiones);
    insertarComboBoxFundacion();
    eventoTipoFalla();
    eventoBusqueda();
}

const obtenerFallas = async () => {

    const response = await fetch(URL);
    const json = await response.json();

    // Obtener todas las propiedades del objeto
    fallas = json.features.map(falla => {
        mapFallas.set(falla.properties.id, falla);
        return falla.properties;
    });

    const regiones = fallas.map(element => element.sector);

    initApplication(regiones);
}

const URL = 'http://mapas.valencia.es/lanzadera/opendata/Monumentos_falleros/JSON';
let fallas;
let limiteFallasCargadas;

// Almacena => clave: idFalla, valor: ObjetoFalla
const mapFallas = new Map();

const contenedorFallas = document.querySelector('#contenedorFallas');

// Muestra la ubicación en un mapa por geolocalización
const mapa = new Mapa('myMap');

// Clase con la lógica de las votaciones de las fallas
const starRating = new StarRating();

window.onload = obtenerFallas;
