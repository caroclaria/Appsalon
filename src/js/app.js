let paso = 1;
const pasoFinal= 3;
const pasoInicial= 1;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function (){
    iniciarApp();
});

function iniciarApp (){
    mostrarseccion(); //muestra y oculta las secciones
    tabs (); //cambia la seccion cuando se presionen los tabs
    botonesPaginador(); //agrega o quita lo botones
    paginasiguiente();
    paginaAnterior();
    consultarAPI(); //consultar la api en el backend de php
    idCliente();
    nombreCliente();//añade el nombre del cliente al objeto de cita
    seleccionarFecha();//añade fecha de la cita en el objeto
    seleccionarHora();
    mostrarResumen();

}
function mostrarseccion(){
    //ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar')
    }

    //seleccionar la seccion con el paso
    const pasoselector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoselector);
    seccion.classList.add('mostrar');

    //quita la clase de actual al anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    //resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');

}

function tabs(){
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach(boton =>{
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso);
            mostrarseccion();
            botonesPaginador();
        })
    })
}

function botonesPaginador(){
    const paginaAnterior = document.querySelector('#anterior');
    const paginasiguiente = document.querySelector('#siguiente');

    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginasiguiente.classList.remove('ocultar');
    } else if (paso === 3){
        paginaAnterior.classList.remove('ocultar');
        paginasiguiente.classList.add('ocultar');

        mostrarResumen();
    }else {
        paginaAnterior.classList.remove('ocultar');
        paginasiguiente.classList.remove('ocultar');

    }
    mostrarseccion();  
}
function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function (){
        if (paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    })

}

function paginasiguiente() {
    const paginasiguiente = document.querySelector('#siguiente');
    paginasiguiente.addEventListener('click', function (){
        if (paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    })
}

async function consultarAPI(){
    try{
        const url = '/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarservicios(servicios);
    } catch (error) {
        console.log(error);
    }

}
function mostrarservicios(servicios){
    servicios.forEach(servicio =>{
        const { id, nombre, precio } = servicio;
        const nombreservicio = document.createElement('P');
        nombreservicio.classList.add('nombre-servicio');
        nombreservicio.textContent = nombre;

        const precioservicio = document.createElement('P');
        precioservicio.classList.add('precio-servicio');
        precioservicio.textContent = `$${precio}`;

       const servicioDiv = document.createElement('DIV');
       servicioDiv.classList.add('servicio');
       servicioDiv.dataset.idservicio= id;
       servicioDiv.onclick = function (){
        seleccionarservicio(servicio);
       }

       servicioDiv.appendChild(nombreservicio);
       servicioDiv.appendChild(precioservicio);

       document.querySelector('#servicios').appendChild(servicioDiv);

    });

}

function seleccionarservicio(servicio){
    const { id } = servicio;
    const { servicios } = cita;

    //identificar el elemento al que se le da click
    const divservicio = document.querySelector(`[data-idservicio="${id}"]`);
    //comprobar si un servicio ya fue agregado
    if(servicios.some(agregado => agregado.id === id)){
        //eliminarlo
        cita.servicios= servicios.filter(agregado => agregado.id !== id);
        divservicio.classList.remove('seleccionado');
    } else{
        //agregarlo
         cita.servicios = [...servicios, servicio];
         divservicio.classList.add('seleccionado');
    }
    
    //console.log(cita);
}
function idCliente (){
    cita.id = document.querySelector('#id').value;
}
function nombreCliente () {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){
        const dia = new Date(e.target.value).getUTCDay();
        if([6, 0].includes(dia)){
            e.target.value= '';
            mostrarAlerta('Fines de semana no permitido', 'error', '.formulario');
        }else {
            cita.fecha= e.target.value;
        }
    });
}
function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){
        const horaCita= e.target.value;
        const hora =horaCita.split(":")[0];
        if(hora <10 || hora >18){
            e.target.value= '';
            mostrarAlerta('Hora no valida', 'error', '.formulario')
        }else {
            cita.hora= e.target.value;
            //console.log(cita);
        }
    })
}
function mostrarAlerta(mensaje, tipo, elemento, desaparece = true){
    //previene que se genere mas de una alerta
    const alertaPrevia =document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }


    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add('error');

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);
    if(desaparece){
       //elimina la alerta luego de 3 seg
        setTimeout(()=>{
            alerta.remove();
        },3000); 
    }
    
}
function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');

    //limpiar contenido de resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0){
        mostrarAlerta('Faltan datos de servicios, fecha u hora', 'error', '.contenido-resumen',false)
        
        return;

    }
    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios} = cita;

    // Heading para Servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

     // Iterando y mostrando los servicios
     servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });
    
    // Heading para Cita en Resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia));
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    const fechaFormateada = fechaUTC.toLocaleDateString('es-AR', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // Boton para Crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;
    
    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);

}
async function reservarCita(){
    const {nombre, fecha, hora, servicios, id } = cita;
    const servicioId = servicios.map(servicio => servicio.id)
    
    const datos = new FormData();
    datos.append('usuarioId', id);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', servicioId);

    try {//peticion hacia la APi
    const url = '/api/citas';
    const respuesta = await fetch(url, {
        method: 'POST',
        body: datos
    });

    const resultado = await respuesta.json();
    console.log(resultado.resultado);

    if(resultado.resultado){
    Swal.fire({
        icon: 'success',
        title: 'Cita creada',
        text: 'Tu cita fue creada correctamente',
        button: 'OK'
      }).then(() =>{
        setTimeout(() => {
            window.location.reload();
        }, 3000);
      })
    }
    //console.log([...datos]);      
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita'
          })
    }
}    