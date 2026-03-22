// ============================================================
// ARCHIVO: js/juego.js
// Lógica principal de la pantalla de juego.
// Aquí ocurre todo: plantar, cosechar, herramientas y guardado.
// ============================================================

import Cultivo    from "./clases/Cultivo.js";
import Granjero   from "./clases/Granjero.js";
import Herramienta from "./clases/Herramienta.js";
import semillas   from "../datos/semillas.js";


// ============================================================
// 1. CARGAR LA PARTIDA GUARDADA
// Leemos los datos del jugador que están en localStorage.
// ============================================================

const datosGuardados = JSON.parse(localStorage.getItem("partidaGranja"));

// Si no hay partida, volvemos al menú
if (!datosGuardados) {
    alert("No hay partida. Vuelve al menú.");
    window.location.href = "index.html";
}

// Creamos el objeto Granjero con los datos guardados
const granjero = new Granjero(
    datosGuardados.nombre,
    datosGuardados.dificultad,
    datosGuardados.dinero,
    datosGuardados.energia
);

// Restauramos el inventario guardado (si tiene semillas de antes)
granjero.inventario = datosGuardados.inventario || {};


// ============================================================
// 2. CREAR LAS HERRAMIENTAS
// Las 3 herramientas siempre existen desde el principio.
// Cada una tiene 3 niveles con efectos diferentes.
// ============================================================

// AZADA: multiplica el precio de venta al cosechar
const azada = new Herramienta("Azada", "🪓", [
    { nombre: "Básica",   costo: 0,   efecto: 1.0 },
    { nombre: "Mejorada", costo: 80,  efecto: 1.3 },
    { nombre: "Maestra",  costo: 200, efecto: 1.6 }
]);

// REGADERA: reduce el tiempo de maduración de las plantas
const regadera = new Herramienta("Regadera", "🪣", [
    { nombre: "Básica",   costo: 0,   efecto: 1.0 }, // Sin reducción
    { nombre: "Mejorada", costo: 80,  efecto: 0.7 }, // 30% más rápido
    { nombre: "Maestra",  costo: 200, efecto: 0.5 }  // 50% más rápido
]);

// HOZ: multiplica los frutos obtenidos al cosechar
const hoz = new Herramienta("Hoz", "🌙", [
    { nombre: "Básica",   costo: 0,   efecto: 1.0 },
    { nombre: "Mejorada", costo: 80,  efecto: 1.3 },
    { nombre: "Maestra",  costo: 200, efecto: 1.6 }
]);

// Si había herramientas guardadas, restauramos sus niveles
const herrsGuardadas = datosGuardados.herramientas;
if (herrsGuardadas) {
    azada.nivelActual    = herrsGuardadas.azada    || 0;
    regadera.nivelActual = herrsGuardadas.regadera || 0;
    hoz.nivelActual      = herrsGuardadas.hoz      || 0;
}


// ============================================================
// 3. CARGAR EL TERRENO
// El terreno es un array de 12 posiciones.
// Cada posición es null (vacío) o un objeto Cultivo.
// ============================================================

const NUM_PARCELAS = 12;

// Intentamos cargar el terreno guardado
const terrenoGuardado = JSON.parse(localStorage.getItem("terreno"));

// Array que almacena los cultivos de cada parcela
// Si hay terreno guardado lo usamos, si no creamos uno vacío
const terreno = new Array(NUM_PARCELAS).fill(null);

if (terrenoGuardado) {
    // Reconstruimos cada cultivo como objeto Cultivo real
    // (porque al guardar en JSON pierden sus métodos)
    terrenoGuardado.forEach((dato, i) => {
        if (dato) {
            const c = new Cultivo(dato.nombre, dato.emoji, dato.precio, dato.tiempo);
            c.estado         = dato.estado;
            c.tiempoPlantado = dato.tiempoPlantado;
            terreno[i] = c;
        }
    });
}


// ============================================================
// 4. REFERENCIAS A ELEMENTOS DEL HTML
// ============================================================

const spanNombre     = document.getElementById("nombre");
const spanDificultad = document.getElementById("dificultad");
const spanDinero     = document.getElementById("dinero");
const spanEnergia    = document.getElementById("energia");
const listaInventario = document.getElementById("inventario-lista");
const panelHerramientas = document.getElementById("herramientas-lista");
const parcelas        = document.querySelectorAll(".parcela");


// ============================================================
// 5. SEMILLA SELECCIONADA PARA PLANTAR
// Esta variable guarda qué semilla tiene seleccionada el jugador.
// Se actualiza al pulsar un botón del selector de semillas.
// ============================================================

let semillaSeleccionada = null;


// ============================================================
// 6. COSTOS DE ENERGÍA POR ACCIÓN
// ============================================================

const ENERGIA_PLANTAR  = 5;
const ENERGIA_COSECHAR = 2;


// ============================================================
// 7. FUNCIONES PARA ACTUALIZAR LA PANTALLA
// ============================================================

// Actualiza el panel con los datos del jugador
function mostrarDatosJugador() {
    spanNombre.textContent     = granjero.nombre;
    spanDificultad.textContent = granjero.dificultad;
    spanDinero.textContent     = granjero.dinero;
    spanEnergia.textContent    = granjero.energia;
}

// Muestra el inventario de semillas del jugador
function mostrarInventario() {
    listaInventario.innerHTML = "";
    const claves = Object.keys(granjero.inventario);

    if (claves.length === 0) {
        listaInventario.innerHTML = "<p style='color:#aaa; font-size:14px;'>Sin semillas. Ve a la tienda.</p>";
        return;
    }

    claves.forEach(nombre => {
        const cantidad = granjero.inventario[nombre];
        const semilla  = semillas.find(s => s.nombre === nombre);
        const emoji    = semilla ? semilla.emoji : "🌱";

        const div = document.createElement("div");
        div.className = "inventario-item";
        div.innerHTML = `<span>${emoji} ${nombre}</span> <strong>x${cantidad}</strong>`;
        listaInventario.appendChild(div);
    });
}

// Muestra las herramientas con sus niveles y botones de mejora
function mostrarHerramientas() {
    panelHerramientas.innerHTML = "";

    // Array con las 3 herramientas y un texto que explica qué hace cada una
    const lista = [
        { obj: azada,    clave: "azada",    desc: "Más dinero al vender" },
        { obj: regadera, clave: "regadera", desc: "Maduración más rápida" },
        { obj: hoz,      clave: "hoz",      desc: "Más frutos al cosechar" }
    ];

    lista.forEach(({ obj, clave, desc }) => {
        const costo = obj.costoMejora();

        const div = document.createElement("div");
        div.className = "herramienta-item";
        div.innerHTML = `
            <span>${obj.emoji} <strong>${obj.nombre}</strong> — ${obj.nombreNivel()}</span>
            <small>${desc}</small>
            <button class="btn-mejorar" data-clave="${clave}"
                ${costo === null ? "disabled" : ""}>
                ${costo === null ? "Máximo" : `Mejorar ($${costo})`}
            </button>
        `;
        panelHerramientas.appendChild(div);
    });

    // Evento para cada botón de mejorar
    document.querySelectorAll(".btn-mejorar").forEach(btn => {
        btn.addEventListener("click", function () {
            const clave = this.dataset.clave;

            // Buscamos la herramienta por su clave
            const herramienta = clave === "azada" ? azada
                                : clave === "regadera" ? regadera
                                : hoz;

            const costo = herramienta.costoMejora();

            if (granjero.gastarDinero(costo)) {
                herramienta.mejorar();
                guardar();
                mostrarDatosJugador();
                mostrarHerramientas(); // Redibujamos el panel
                alert(`✅ ${herramienta.nombre} mejorada a: ${herramienta.nombreNivel()}`);
            } else {
                alert(`❌ Necesitas $${costo} para mejorar.`);
            }
        });
    });
}

// Actualiza el aspecto visual de una parcela según su estado
function mostrarParcela(index) {
    const parcela = parcelas[index];
    const cultivo = terreno[index];

    if (!cultivo) {
        // Parcela vacía → color tierra
        parcela.textContent = "";
        parcela.style.backgroundColor = "#8b5a2b";
        parcela.title = "Vacía - haz clic para plantar";
        return;
    }

    if (cultivo.estaListo()) {
        // Lista para cosechar → muestra el emoji del fruto
        parcela.textContent = cultivo.emoji;
        parcela.style.backgroundColor = "#f0c040"; // amarillo
        parcela.title = `${cultivo.nombre} - ¡Listo! Haz clic para cosechar`;
    } else {
        // Creciendo → semilla verde
        const restante = cultivo.tiempoRestante();
        parcela.textContent = "🌱";
        parcela.style.backgroundColor = "#4a7c40"; // verde
        parcela.title = `${cultivo.nombre} - Listo en ${restante}s`;
    }
}


// ============================================================
// 8. FUNCIÓN GUARDAR
// Guarda todo el estado del juego en localStorage.
// Se llama después de cada acción importante.
// ============================================================

function guardar() {
    // Guardamos los datos del jugador
    localStorage.setItem("partidaGranja", JSON.stringify({
        nombre:     granjero.nombre,
        dificultad: granjero.dificultad,
        dinero:     granjero.dinero,
        energia:    granjero.energia,
        inventario: granjero.inventario,
        // Guardamos el nivel actual de cada herramienta
        herramientas: {
            azada:    azada.nivelActual,
            regadera: regadera.nivelActual,
            hoz:      hoz.nivelActual
        }
    }));

    // Guardamos el terreno (solo los datos, no los métodos)
    const datosTerreno = terreno.map(cultivo => {
        if (!cultivo) return null;
        return {
            nombre:        cultivo.nombre,
            emoji:         cultivo.emoji,
            precio:        cultivo.precio,
            tiempo:        cultivo.tiempo,
            estado:        cultivo.estado,
            tiempoPlantado: cultivo.tiempoPlantado // necesario para calcular tiempo restante
        };
    });
    localStorage.setItem("terreno", JSON.stringify(datosTerreno));
}


// ============================================================
// 9. SELECTOR DE SEMILLAS
// Al pulsar un botón de semilla, se queda "seleccionada"
// para plantar en la parcela que elija el jugador.
// ============================================================

document.querySelectorAll(".semilla").forEach(btn => {
    btn.addEventListener("click", function () {
        const nombre = this.dataset.nombre;

        // Comprobamos que tiene esa semilla en el inventario
        if (!granjero.inventario[nombre] || granjero.inventario[nombre] <= 0) {
            alert(`No tienes ${nombre}. Cómprala en la tienda.`);
            return;
        }

        // Guardamos la semilla seleccionada
        semillaSeleccionada = nombre;

        // Marcamos visualmente el botón activo (borde amarillo)
        document.querySelectorAll(".semilla").forEach(b => b.style.border = "2px solid transparent");
        this.style.border = "3px solid yellow";

        alert(`Semilla seleccionada: ${nombre}. Ahora haz clic en una parcela vacía.`);
    });
});


// ============================================================
// 10. CLIC EN PARCELAS → PLANTAR O COSECHAR
// ============================================================

parcelas.forEach((parcela, index) => {
    parcela.addEventListener("click", function () {

        const cultivo = terreno[index];

        // ---- CASO 1: Parcela vacía → PLANTAR ----
        if (!cultivo) {

            if (!semillaSeleccionada) {
                alert("Primero selecciona una semilla del panel.");
                return;
            }

            if (!granjero.inventario[semillaSeleccionada] || granjero.inventario[semillaSeleccionada] <= 0) {
                alert("No tienes esa semilla en el inventario.");
                semillaSeleccionada = null;
                return;
            }

            if (!granjero.gastarEnergia(ENERGIA_PLANTAR)) {
                alert("No tienes energía suficiente. Descansa.");
                return;
            }

            // Buscamos los datos de la semilla en nuestra lista
            const datosSemilla = semillas.find(s => s.nombre === semillaSeleccionada);

            // Calculamos el tiempo real aplicando el efecto de la Regadera
            // Si la regadera es "Mejorada" (efecto 0.7), el tiempo será 30% más corto
            const tiempoReal = Math.round(datosSemilla.tiempo * regadera.efecto());

            // Creamos el cultivo y lo plantamos
            const nuevoCultivo = new Cultivo(
                datosSemilla.nombre,
                datosSemilla.emoji,
                datosSemilla.venta,
                tiempoReal
            );
            nuevoCultivo.plantar();

            // Lo guardamos en el array del terreno
            terreno[index] = nuevoCultivo;

            // Quitamos la semilla del inventario
            granjero.usarSemilla(semillaSeleccionada);

            // Actualizamos pantalla y guardamos
            mostrarParcela(index);
            mostrarDatosJugador();
            mostrarInventario();
            guardar();

            // Timer: cuando madure, actualizamos la parcela automáticamente
            setTimeout(() => {
                nuevoCultivo.estado = "listo";
                mostrarParcela(index);
                guardar();
            }, tiempoReal * 1000);

            // Timer cada segundo para actualizar el tooltip con el tiempo restante
            const intervalo = setInterval(() => {
                if (nuevoCultivo.estaListo()) {
                    clearInterval(intervalo); // Paramos cuando ya está listo
                } else {
                    mostrarParcela(index); // Actualizamos el tooltip
                }
            }, 1000);

            return;
        }

        // ---- CASO 2: Cultivo listo → COSECHAR ----
        if (cultivo.estaListo()) {

            if (!granjero.gastarEnergia(ENERGIA_COSECHAR)) {
                alert("No tienes energía para cosechar. Descansa.");
                return;
            }

            // Calculamos el dinero con los efectos de Azada y Hoz
            // Azada mejora el precio, Hoz mejora la cantidad de frutos
            const dineroBase  = cultivo.cosechar();
            const dineroFinal = Math.round(dineroBase * azada.efecto() * hoz.efecto());

            granjero.ganarDinero(dineroFinal);
            terreno[index] = null; // La parcela queda vacía

            mostrarParcela(index);
            mostrarDatosJugador();
            guardar();

            alert(`🌾 Cosechaste ${cultivo.nombre}\n💰 Ganaste: $${dineroFinal}`);
            return;
        }

        // ---- CASO 3: Cultivo plantado pero NO listo → advertencia ----
        if (cultivo.estado === "plantado") {
            const restante = cultivo.tiempoRestante();
            const confirmar = confirm(
                `⚠️ ${cultivo.nombre} no está listo (faltan ${restante}s).\n` +
                `Si lo arrancas ahora lo PERDERÁS. ¿Continuar?`
            );

            if (confirmar) {
                cultivo.cosechar(); // Devuelve 0, se pierde el cultivo
                terreno[index] = null;
                mostrarParcela(index);
                guardar();
                alert("El cultivo se ha perdido.");
            }
        }
    });
});


// ============================================================
// 11. BOTONES DE ACCIÓN
// ============================================================

// Descansar: recupera 25 de energía
document.getElementById("descansar").addEventListener("click", () => {
    granjero.recuperarEnergia(25);
    mostrarDatosJugador();
    guardar();
    alert("💤 Has descansado. +25 energía.");
});

// Ir a la tienda
document.getElementById("ir-tienda").addEventListener("click", () => {
    guardar();
    window.location.href = "tienda.html";
});

// Volver al menú
document.getElementById("volver-menu").addEventListener("click", () => {
    guardar();
    window.location.href = "index.html";
});


// ============================================================
// 12. ARRANCAR TIMERS AL VOLVER AL JUEGO
// Cuando el jugador cierra la página y vuelve, los setTimeout
// se habían perdido. Aquí los recreamos para las plantas
// que todavía están creciendo.
// ============================================================

terreno.forEach((cultivo, index) => {
    if (cultivo && cultivo.estado === "plantado") {
        const restanteMs = cultivo.tiempoRestante() * 1000;

        if (restanteMs <= 0) {
            // Ya debería estar lista (el jugador estuvo fuera mucho tiempo)
            cultivo.estado = "listo";
            mostrarParcela(index);
            guardar();
        } else {
            // Recreamos el timer con el tiempo real que queda
            setTimeout(() => {
                cultivo.estado = "listo";
                mostrarParcela(index);
                guardar();
            }, restanteMs);

            // Y el intervalo para actualizar el tooltip cada segundo
            const intervalo = setInterval(() => {
                if (cultivo.estaListo()) {
                    clearInterval(intervalo);
                } else {
                    mostrarParcela(index);
                }
            }, 1000);
        }
    }
});


// ============================================================
// 13. INICIALIZACIÓN: mostramos todo al cargar la página
// ============================================================

mostrarDatosJugador();
mostrarInventario();
mostrarHerramientas();
parcelas.forEach((_, i) => mostrarParcela(i));
