// =======================
// Datos precargados
// =======================

// Códigos postales (ejemplos, puedes agregar más)
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

// Oficios (ejemplos)
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

// Números oficiales Veracruz (ejemplos)
const NUMEROS_OFICIALES = [
    { nombre: "Emergencias (nacional)", telefono: "911", descripcion: "Atención a emergencias médicas, de seguridad y protección civil." },
    { nombre: "Protección Civil Veracruz", telefono: "01 800 716 3410", descripcion: "Reporte de riesgos, desastres naturales y apoyo en contingencias." },
    { nombre: "Cruz Roja Veracruz", telefono: "229 932 1212", descripcion: "Servicio de ambulancias y atención médica de emergencia (ejemplo)." },
    { nombre: "Locatel Veracruz (ejemplo)", telefono: "800 123 4567", descripcion: "Orientación ciudadana e información de servicios públicos." },
    { nombre: "Gobierno del Estado de Veracruz (conmutador)", telefono: "228 841 7700", descripcion: "Conmutador general del Gobierno del Estado (ejemplo)." },
    { nombre: "Denuncia anónima", telefono: "089", descripcion: "Línea para denuncias anónimas de delitos." }
];

// =======================
// Agenda: almacenamiento
// =======================

const CLAVE_EVENTOS = "agenda_compartamos_eventos";
let eventos = [];

// Fecha de hoy en formato YYYY-MM-DD
function obtenerFechaHoy() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
}

function cargarEventos() {
    try {
        const guardado = localStorage.getItem(CLAVE_EVENTOS);
        eventos = guardado ? JSON.parse(guardado) : [];
    } catch (e) {
        console.error("No se pudieron cargar las actividades", e);
        eventos = [];
    }
}

function guardarEventos() {
    try {
        localStorage.setItem(CLAVE_EVENTOS, JSON.stringify(eventos));
    } catch (e) {
        console.error("No se pudieron guardar las actividades", e);
    }
}

// =======================
// Renderizar actividades
// =======================

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

// Actividades de hoy en el encabezado
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

// =======================
// Formularios
// =======================

function configurarFormularioActividades() {
    const formulario = document.getElementById("form-actividad");
    if (!formulario) return;

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
        document.getElementById("fecha-actividad").value = fecha;
    });
}

// =======================
// Paneles (botones)
// =======================

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

// =======================
// Buscador Códigos Postales
// =======================

function configurarBuscadorCP() {
    const input = document.getElementById("input-cp");
    const boton = document.getElementById("btn-buscar-cp");
    const cuerpoTabla = document.getElementById("tabla-cp");
    const mensajeSinResultados = document.getElementById("cp-sin-resultados");

    if (!input || !boton) return;

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
    input.addEventListener("keyup", () => realizarBusqueda());

    realizarBusqueda(); // mostrar todo al inicio
}

// =======================
// Listado de oficios
// =======================

function configurarListadoOficios() {
    const input = document.getElementById("input-oficios");
    const lista = document.getElementById("lista-oficios");
    if (!input || !lista) return;

    function renderizar(termino = "") {
        lista.innerHTML = "";
        const t = termino.trim().toLowerCase();

        const filtrados = OFICIOS.filter(of =>
            !t ||
            of.nombre.toLowerCase().includes(t) ||
            of.descripcion.toLowerCase().includes(t)
        );

        if (!filtrados.length) {
            const li = document.createElement("li");
            li.className = "texto-secundario";
            li.textContent = "No se encontraron oficios con ese criterio.";
            lista.appendChild(li);
            return;
        }

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
    }

    input.addEventListener("input", () => renderizar(input.value));
    renderizar();
}

// =======================
// Listado de números
// =======================

function configurarListadoNumeros() {
    const input = document.getElementById("input-numeros");
    const lista = document.getElementById("lista-numeros");
    if (!input || !lista) return;

    function renderizar(termino = "") {
        lista.innerHTML = "";
        const t = termino.trim().toLowerCase();

        const filtrados = NUMEROS_OFICIALES.filter(num =>
            !t ||
            num.nombre.toLowerCase().includes(t) ||
            num.descripcion.toLowerCase().includes(t)
        );

        if (!filtrados.length) {
            const li = document.createElement("li");
            li.className = "texto-secundario";
            li.textContent = "No se encontraron números con ese criterio.";
            lista.appendChild(li);
            return;
        }

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
    }

    input.addEventListener("input", () => renderizar(input.value));
    renderizar();
}

// =======================
// Calculadora de ciclos
// =======================

function configurarCalculadoraCiclos() {
    const formulario = document.getElementById("form-ciclo");
    const inputFecha = document.getElementById("fecha-inicio-ciclo");
    const contResultados = document.getElementById("resultados-ciclo");
    const spanFinCiclo = document.getElementById("fecha-fin-ciclo");
    const spanSemana13 = document.getElementById("fecha-semana-13");
    const spanRecordatorio = document.getElementById("texto-recordatorio");
    const mensajeError = document.getElementById("mensaje-error-ciclo");
    const botonAgregar = document.getElementById("btn-agregar-semana13");

    if (!formulario || !inputFecha) return;

    let ultimaSemana13ISO = null;
    let ultimaDescripcionBase = "";

    // Preseleccionar hoy
    inputFecha.value = obtenerFechaHoy();

    function sumarDias(fecha, dias) {
        const f = new Date(fecha);
        f.setDate(f.getDate() + dias);
        return f;
    }

    function formatearFecha(fecha) {
        const opciones = { year: "numeric", month: "2-digit", day: "2-digit" };
        return fecha.toLocaleDateString("es-MX", opciones);
    }

    function formatearISO(fecha) {
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");
        return `${año}-${mes}-${dia}`;
    }

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const valor = inputFecha.value;
        if (!valor) {
            mensajeError.classList.remove("oculto");
            contResultados.classList.add("oculto");
            return;
        }

        const inicio = new Date(valor + "T00:00:00");
        if (isNaN(inicio.getTime())) {
            mensajeError.classList.remove("oculto");
            contResultados.classList.add("oculto");
            return;
        }

        // Semana 16 = inicio + 15*7 días
        // Semana 13 = inicio + 12*7 días
        const finCiclo = sumarDias(inicio, 15 * 7);
        const semana13 = sumarDias(inicio, 12 * 7);

        spanFinCiclo.textContent = formatearFecha(finCiclo);
        spanSemana13.textContent = formatearFecha(semana13);

        ultimaSemana13ISO = formatearISO(semana13);
        ultimaDescripcionBase = `Ciclo iniciado el ${formatearFecha(inicio)}.`;

        spanRecordatorio.textContent =
            `Programar visita para firma de renovación en semana 13: ${formatearFecha(semana13)}.`;

        mensajeError.classList.add("oculto");
        contResultados.classList.remove("oculto");
    });

    if (botonAgregar) {
        botonAgregar.addEventListener("click", () => {
            if (!ultimaSemana13ISO) {
                alert("Primero calcula el ciclo para saber la fecha de la semana 13.");
                return;
            }

            const nuevoEvento = {
                id: Date.now(),
                fecha: ultimaSemana13ISO,
                hora: "",
                titulo: "Firma documentación de renovación (semana 13)",
                descripcion: ultimaDescripcionBase
            };

            eventos.push(nuevoEvento);
            guardarEventos();
            renderizarActividades();
            renderizarActividadesDeHoy();

            alert("Actividad de semana 13 agregada al calendario.");

            // Notificación (si el usuario dio permiso)
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("Semana 13 programada", {
                    body: `Firma de renovación el ${spanSemana13.textContent}`,
                    icon: "icon-192.png"
                });
            }
        });
    }
}

// =======================
// Notificaciones
// =======================

function pedirPermisoNotificaciones() {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
        Notification.requestPermission().then(perm => {
            if (perm === "granted") {
                new Notification("Notificaciones activadas", {
                    body: "Podrás recibir recordatorios de tu agenda.",
                    icon: "icon-192.png"
                });
            }
        });
    }
}

// =======================
// Inicialización general
// =======================

document.addEventListener("DOMContentLoaded", () => {
    cargarEventos();
    configurarFormularioActividades();
    configurarBotonesPaneles();
    configurarBuscadorCP();
    configurarListadoOficios();
    configurarListadoNumeros();
    configurarCalculadoraCiclos();
    renderizarActividades();
    renderizarActividadesDeHoy();

    const campoFecha = document.getElementById("fecha-actividad");
    if (campoFecha) {
        campoFecha.value = obtenerFechaHoy();
    }

    pedirPermisoNotificaciones();
});

// =======================
// Service Worker (PWA)
// =======================

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("Service Worker registrado"))
        .catch(err => console.log("Error al registrar SW:", err));
}
