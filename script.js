
// Datos precargados: códigos postales de ejemplo (principalmente Veracruz)
const CODIGOS_POSTALES = [
    { cp: "91700", colonia: "Centro", municipio: "Veracruz", estado: "Veracruz" },
    { cp: "91910", colonia: "Reforma", municipio: "Veracruz", estado: "Veracruz" },
    { cp: "94290", colonia: "Boca del Río Centro", municipio: "Boca del Río", estado: "Veracruz" },
    { cp: "91000", colonia: "Centro", municipio: "Xalapa", estado: "Veracruz" },
    { cp: "91070", colonia: "Ánimas", municipio: "Xalapa", estado: "Veracruz" },
    { cp: "80100", colonia: "Centro", municipio: "Culiacán", estado: "Sinaloa" },
    { cp: "01000", colonia: "San Ángel", municipio: "Álvaro Obregón", estado: "Ciudad de México" },
    { cp: "54000", colonia: "Tlalnepantla Centro", municipio: "Tlalnepantla de Baz", estado: "Estado de México" }
];

// Oficios precargados de clientes típicos
const OFICIOS = [
    { nombre: "Comerciante", descripcion: "Venta de productos diversos en mercado, tianguis o local." },
    { nombre: "Tortillera", descripcion: "Elaboración y venta de tortillas de maíz o harina." },
    { nombre: "Taxista", descripcion: "Servicio de transporte público en vehículo particular." },
    { nombre: "Abarrotero", descripcion: "Dueño de tienda de abarrotes o miscelánea." },
    { nombre: "Estilista", descripcion: "Servicios de belleza, estética y barbería." },
    { nombre: "Costurera", descripcion: "Confección y reparación de prendas de vestir." },
    { nombre: "Taquero", descripcion: "Venta de alimentos preparados (tacos, antojitos, etc.)." },
    { nombre: "Panadero", descripcion: "Elaboración y venta de pan y repostería." }
];

// Números oficiales de Veracruz (ejemplos, siempre verificar contra fuentes oficiales)
const NUMEROS_OFICIALES = [
    { nombre: "Emergencias (nacional)", telefono: "911", descripcion: "Atención a emergencias médicas, de seguridad y protección civil." },
    { nombre: "Protección Civil Veracruz", telefono: "01 800 716 3410", descripcion: "Reporte de riesgos, desastres naturales y apoyo en contingencias." },
    { nombre: "Cruz Roja Veracruz", telefono: "229 932 1212", descripcion: "Servicio de ambulancias y atención médica de emergencia (ejemplo)." },
    { nombre: "Locatel Veracruz (ejemplo)", telefono: "800 123 4567", descripcion: "Orientación ciudadana e información de servicios públicos." },
    { nombre: "Gobierno del Estado de Veracruz (conmutador)", telefono: "228 841 7700", descripcion: "Conmutador general del Gobierno del Estado (ejemplo de referencia)." },
    { nombre: "Denuncia anónima", telefono: "089", descripcion: "Línea para denuncias anónimas de delitos." }
];

// Clave para almacenar actividades en localStorage
const CLAVE_EVENTOS = "agenda_compartamos_eventos";

let eventos = [];

// Utilidad: obtener fecha de hoy en formato YYYY-MM-DD
function obtenerFechaHoy() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
}

// Cargar eventos desde localStorage
function cargarEventos() {
    try {
        const guardado = localStorage.getItem(CLAVE_EVENTOS);
        eventos = guardado ? JSON.parse(guardado) : [];
    } catch (e) {
        console.error("No se pudieron cargar las actividades", e);
        eventos = [];
    }
}

// Guardar eventos en localStorage
function guardarEventos() {
    try {
        localStorage.setItem(CLAVE_EVENTOS, JSON.stringify(eventos));
    } catch (e) {
        console.error("No se pudieron guardar las actividades", e);
    }
}

// Renderizar la tabla completa de actividades
function renderizarActividades() {
    const cuerpoTabla = document.getElementById("tabla-actividades");
    const mensajeSinRegistro = document.getElementById("actividades-sin-registro");

    cuerpoTabla.innerHTML = "";

    if (!eventos.length) {
        mensajeSinRegistro.classList.remove("oculto");
        return;
    } else {
        mensajeSinRegistro.classList.add("oculto");
    }

    // Copia ordenada por fecha y hora
    const ordenados = [...eventos].sort((a, b) => {
        const da = (a.fecha || "") + " " + (a.hora || "");
        const db = (b.fecha || "") + " " + (b.hora || "");
        return da.localeCompare(db);
    });

    for (const ev of ordenados) {
        const fila = document.createElement("tr");

        const celdaFecha = document.createElement("td");
        celdaFecha.textContent = ev.fecha || "-";

        const celdaHora = document.createElement("td");
        celdaHora.textContent = ev.hora || "-";

        const celdaTitulo = document.createElement("td");
        celdaTitulo.textContent = ev.titulo;

        const celdaDescripcion = document.createElement("td");
        celdaDescripcion.textContent = ev.descripcion || "";

        fila.appendChild(celdaFecha);
        fila.appendChild(celdaHora);
        fila.appendChild(celdaTitulo);
        fila.appendChild(celdaDescripcion);

        cuerpoTabla.appendChild(fila);
    }
}

// Renderizar actividades solo del día de hoy en el encabezado
function renderizarActividadesDeHoy() {
    const listaHoy = document.getElementById("lista-actividades-hoy");
    listaHoy.innerHTML = "";

    const hoy = obtenerFechaHoy();
    const deHoy = eventos.filter(ev => ev.fecha === hoy);

    if (!deHoy.length) {
        const li = document.createElement("li");
        li.className = "texto-secundario";
        li.textContent = "Aún no hay actividades para hoy.";
        listaHoy.appendChild(li);
        return;
    }

    for (const ev of deHoy) {
        const li = document.createElement("li");
        const spanHora = document.createElement("span");
        spanHora.className = "fecha";
        spanHora.textContent = ev.hora ? `${ev.hora} - ` : "";

        li.appendChild(spanHora);
        li.append(ev.titulo);
        listaHoy.appendChild(li);
    }
}

// Manejar envío del formulario de actividades
function configurarFormularioActividades() {
    const formulario = document.getElementById("form-actividad");

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const fecha = document.getElementById("fecha-actividad").value;
        const hora = document.getElementById("hora-actividad").value;
        const titulo = document.getElementById("titulo-actividad").value.trim();
        const descripcion = document.getElementById("descripcion-actividad").value.trim();

        if (!fecha || !titulo) {
            alert("Por favor, captura al menos la fecha y el título de la actividad.");
            return;
        }

        const nuevoEvento = {
            id: Date.now(),
            fecha,
            hora,
            titulo,
            descripcion
        };

        eventos.push(nuevoEvento);
        guardarEventos();
        renderizarActividades();
        renderizarActividadesDeHoy();

        formulario.reset();
        document.getElementById("fecha-actividad").value = fecha; // opcional: mantener fecha
    });
}

// Mostrar y ocultar paneles según el botón presionado
function configurarBotonesPaneles() {
    const botones = document.querySelectorAll(".boton-accion");
    const paneles = document.querySelectorAll(".panel");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const idPanel = boton.getAttribute("data-panel");
            paneles.forEach(panel => {
                if (panel.id === idPanel) {
                    panel.classList.remove("oculto");
                } else {
                    panel.classList.add("oculto");
                }
            });
        });
    });
}

// Búsqueda de códigos postales
function configurarBuscadorCP() {
    const input = document.getElementById("input-cp");
    const boton = document.getElementById("btn-buscar-cp");
    const cuerpoTabla = document.getElementById("tabla-cp");
    const mensajeSinResultados = document.getElementById("cp-sin-resultados");

    function realizarBusqueda() {
        const termino = input.value.trim().toLowerCase();
        cuerpoTabla.innerHTML = "";

        let resultados = CODIGOS_POSTALES;

        if (termino) {
            resultados = CODIGOS_POSTALES.filter(item =>
                item.cp.toLowerCase().includes(termino) ||
                item.colonia.toLowerCase().includes(termino) ||
                item.municipio.toLowerCase().includes(termino) ||
                item.estado.toLowerCase().includes(termino)
            );
        }

        if (!resultados.length) {
            mensajeSinResultados.classList.remove("oculto");
            return;
        } else {
            mensajeSinResultados.classList.add("oculto");
        }

        for (const item of resultados) {
            const fila = document.createElement("tr");

            const c1 = document.createElement("td");
            c1.textContent = item.cp;

            const c2 = document.createElement("td");
            c2.textContent = item.colonia;

            const c3 = document.createElement("td");
            c3.textContent = item.municipio;

            const c4 = document.createElement("td");
            c4.textContent = item.estado;

            fila.appendChild(c1);
            fila.appendChild(c2);
            fila.appendChild(c3);
            fila.appendChild(c4);

            cuerpoTabla.appendChild(fila);
        }
    }

    boton.addEventListener("click", realizarBusqueda);
    input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            realizarBusqueda();
        } else {
            realizarBusqueda();
        }
    });

    // Mostrar todo al inicio
    realizarBusqueda();
}

// Mostrar oficios en lista con filtro
function configurarListadoOficios() {
    const input = document.getElementById("input-oficios");
    const lista = document.getElementById("lista-oficios");

    function renderizar(termino = "") {
        lista.innerHTML = "";
        const t = termino.trim().toLowerCase();

        const filtrados = OFICIOS.filter(of =>
            !t ||
            of.nombre.toLowerCase().includes(t) ||
            of.descripcion.toLowerCase().includes(t)
        );

        for (const ofi of filtrados) {
            const li = document.createElement("li");
            const strong = document.createElement("strong");
            strong.textContent = ofi.nombre;

            const span = document.createElement("span");
            span.className = "descripcion";
            span.textContent = ofi.descripcion;

            li.appendChild(strong);
            li.appendChild(span);
            lista.appendChild(li);
        }

        if (!filtrados.length) {
            const li = document.createElement("li");
            li.className = "texto-secundario";
            li.textContent = "No se encontraron oficios con ese criterio.";
            lista.appendChild(li);
        }
    }

    input.addEventListener("input", () => renderizar(input.value));
    renderizar();
}

// Mostrar números oficiales en lista con filtro
function configurarListadoNumeros() {
    const input = document.getElementById("input-numeros");
    const lista = document.getElementById("lista-numeros");

    function renderizar(termino = "") {
        lista.innerHTML = "";
        const t = termino.trim().toLowerCase();

        const filtrados = NUMEROS_OFICIALES.filter(num =>
            !t ||
            num.nombre.toLowerCase().includes(t) ||
            num.descripcion.toLowerCase().includes(t)
        );

        for (const num of filtrados) {
            const li = document.createElement("li");

            const strong = document.createElement("strong");
            strong.textContent = `${num.nombre} - ${num.telefono}`;

            const span = document.createElement("span");
            span.className = "descripcion";
            span.textContent = num.descripcion;

            li.appendChild(strong);
            li.appendChild(span);
            lista.appendChild(li);
        }

        if (!filtrados.length) {
            const li = document.createElement("li");
            li.className = "texto-secundario";
            li.textContent = "No se encontraron números con ese criterio.";
            lista.appendChild(li);
        }
    }

    input.addEventListener("input", () => renderizar(input.value));
    renderizar();
}

// Inicialización general
document.addEventListener("DOMContentLoaded", () => {
    cargarEventos();
    configurarFormularioActividades();
    configurarBotonesPaneles();
    configurarBuscadorCP();
    configurarListadoOficios();
    configurarListadoNumeros();
    renderizarActividades();
    renderizarActividadesDeHoy();

    // Por comodidad, preseleccionar hoy en el calendario
    const campoFecha = document.getElementById("fecha-actividad");
    if (campoFecha) {
        campoFecha.value = obtenerFechaHoy();
    }
});
