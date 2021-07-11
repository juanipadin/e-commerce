const listaPlanes = document.querySelector(".planes");
const tableCarrito = document.querySelector('#listado');
const btnvaciarCarrito = document.querySelector("#vaciar-carrito");
const formbuscador = document.querySelector("#formulario")

let carrito = []

/* Listener */
listaPlanes.addEventListener('click', agregarPlan);
tableCarrito.addEventListener('click', borrarPlan);
btnvaciarCarrito.addEventListener('click',vaciarCarrito);
formbuscador.addEventListener('submit', buscarServicios)

document.addEventListener('DOMContentLoaded',() =>{
    //carrito = JSON.parse(localStorage.getItem('carrito'));

    /* primero pregunta si hay algo en el carrito. Si hay algo, lo busca. Si no hay nada continua  */
    if( JSON.parse(localStorage.getItem('carrito'))){
        carrito = JSON.parse(localStorage.getItem('carrito'));
    }

    insertarCarritoHTML();
    renderizarServiciosHTML(servicios); // CARGA POR PRIMERA VEZ LOS PRODUCTOS
});


function buscarServicios(e) {
    e.preventDefault();
    const inputBuscador = document.querySelector("#buscador").value;
    const inputFiltrado = inputBuscador.trim().toLowerCase(); // Quita espacios y pasa minusculas
    const resultado = servicios.filter( servicio => servicio.nombre.toLocaleLowerCase().includes(inputFiltrado)); // Devuelve en la variable resultado el servicio elegido
    renderizarServiciosHTML(resultado);
    formbuscador.reset()
    
}

function renderizarServiciosHTML(producto){ //Crea la tabla con los productos (buscados o iniciales)
    listaPlanes.innerHTML = ''; // Elimina el listado de planes para que se agreguen los buscados
    
    producto.forEach(producto => {
        const {nombre,storage,domains,precio,cantidad,id} = producto; // evita que haya que poner producto.nombre, producto.storage

        const divCard = document.createElement('div'); //crea el elemento
        divCard.classList.add('card'); // le asigna clase 
        divCard.innerHTML=`
        <div class="w3-third w3-margin-bottom">
        <ul class="w3-ul w3-border w3-center w3-hover-shadow">
        <li class="w3-dark-grey w3-xlarge w3-padding-32" id="nombre">${nombre}</li>
            <li id="storage"><b>${storage}GB</b> Storage</li>
            <li id="mails"><b>25</b> Emails</li>
            <li id="domains"><b>${domains}</b> Domains</li>
            <li id="support"><b>Endless</b> Support</li>
            <li class="w3-padding-16">
            <h2 class="w3-wide" id="precio">$ ${precio}</h2>
            <span class="w3-opacity">per month</span>
            </li>
            <li class="w3-light-grey w3-padding-24">
            <button class="w3-button w3-green w3-padding-large" data-id="${id}">Sign Up</button>
            </li>
        </ul>
        </div>
        `
    listaPlanes.appendChild(divCard) // Carga al div "listaPlanes" el HTML.
    })
}


function borrarPlan(e) {
    e.preventDefault();
    if(e.target.classList.contains("borrar-producto")){
        /* OPCIÓN 1 */
//        const productoSeleccionado = e.target.parentElement.parentElement;
//        const productoId = e.target.getAttribute('data-id')
        /* Borrar del HTML */
//        productoSeleccionado.remove();

        /* Borrar de la variable (deja en el carrito solamente los que no hayan sido borrados. se actualiza el carrito) */
//        carrito = carrito.filter(producto => producto.id !== productoId)

        /* Actualizar el Storage */
//        guardarCarritoStorage()

        /* OPCIÓN 2 */
        const productoId = e.target.getAttribute('data-id');
        carrito = carrito.filter(producto => producto.id !== productoId);


        insertarCarritoHTML();
    }

    
}

function vaciarCarrito(e) {
    carrito = [];
    insertarCarritoHTML();
}

function agregarPlan(e) {
    if(e.target.classList.contains("w3-button")){

        const cardProducto =e.target.parentElement.parentElement;
        //console.log(cardProducto)

        obtenerDatosProducto(cardProducto);
    }
}

function obtenerDatosProducto(cardProducto){
    const productoAgregado  = {
        nombre : cardProducto.querySelector("#nombre").textContent,
        storage : cardProducto.querySelector("#storage").textContent,
        domains : cardProducto.querySelector("#domains").textContent,
        precio : cardProducto.querySelector("#precio").textContent,
        cantidad : 1,
        id : cardProducto.querySelector('button').getAttribute('data-id')
    }
    
    const existe = carrito.some( producto => producto.id === productoAgregado.id);

    if (existe){
        const productos = carrito.map (producto => {
            if (producto.id === productoAgregado.id){
                producto.cantidad++;
                producto.precio = `$${Number(productoAgregado.precio.slice(1)) * producto.cantidad}`
                return producto
            } else {
                return producto;
            }
        });
        /* Spread Operator */
        carrito = [...productos];

    } else {
        carrito.push(productoAgregado);
        /* tambien se pude hacer el push asì: */
        //carrito = [...carrito, productoAgregado];

    }
    
    guardarCarritoStorage();

    insertarCarritoHTML()
}

function insertarCarritoHTML () {

    borrarCarritoHTML();
    
    carrito.forEach(producto => {
        /* DECONSTRUIR OBJETOS */
        const {nombre,storage,domains,precio,cantidad,id} = producto;

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${nombre}</td>
        <td>${storage}</td>
        <td>${domains}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td>
        <a href="#" class= "borrar-producto" data-id="${id}">X</a>
        </td>`
        
        tableCarrito.appendChild(row)
    });
    guardarCarritoStorage();
}

function borrarCarritoHTML(){
    /* forma lenta */
    //tableCarrito.innerHTML = '';

    /* forma rápida */
    while(tableCarrito.firstChild){
        tableCarrito.removeChild(tableCarrito.firstChild)
    }
}

function guardarCarritoStorage(){
    localStorage.setItem('carrito',JSON.stringify(carrito));
}

