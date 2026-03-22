// ============================================================
// ARCHIVO: js/tienda.js
// Controla la pantalla de la tienda.
// El jugador puede comprar semillas y vender las que tiene.
// ============================================================

import semillas from "../datos/semillas.js";

// Cargamos los datos del jugador desde localStorage
const partida = JSON.parse(localStorage.getItem("partidaGranja"));

// Si no hay partida, volvemos al menú
if (!partida) {
    alert("No hay partida guardada.");
    window.location.href = "index.html";
}

// Si no tiene inventario guardado, lo inicializamos vacío
if (!partida.inventario) partida.inventario = {};

// Mostramos el dinero actual
const spanDinero = document.getElementById("dinero");
spanDinero.textContent = partida.dinero;


// ============================================================
// SECCIÓN COMPRAR
// Mostramos una tarjeta por cada semilla disponible.
// El jugador puede comprarla si tiene suficiente dinero.
// ============================================================

const contenedorComprar = document.getElementById("seccion-comprar");

semillas.forEach(semilla => {
    const card = document.createElement("div");
    card.className = "semilla-card";

    card.innerHTML = `
        <h3>${semilla.emoji} ${semilla.nombre}</h3>
        <p>Precio: <strong>$${semilla.precio}</strong></p>
        <p>Venta: <strong>$${semilla.venta}</strong></p>
        <p>Tiempo: ${semilla.tiempo}s</p>
        <button class="btn-comprar" data-nombre="${semilla.nombre}" data-precio="${semilla.precio}">
            Comprar
        </button>
    `;

    contenedorComprar.appendChild(card);
});

// Evento para cada botón de comprar
document.querySelectorAll(".btn-comprar").forEach(btn => {
    btn.addEventListener("click", function () {
        const nombre = this.dataset.nombre;
        const precio = parseInt(this.dataset.precio);

        if (partida.dinero >= precio) {
            partida.dinero -= precio; // Restamos el dinero
            partida.inventario[nombre] = (partida.inventario[nombre] || 0) + 1; // Añadimos al inventario

            spanDinero.textContent = partida.dinero; // Actualizamos el dinero en pantalla
            guardarPartida();
            mostrarSeccionVender(); // Actualizamos la sección de venta
            alert(`✅ Compraste 1x ${nombre}`);
        } else {
            alert("❌ No tienes suficiente dinero.");
        }
    });
});


// ============================================================
// SECCIÓN VENDER
// Mostramos las semillas que el jugador tiene en el inventario.
// Puede venderlas para recuperar dinero.
// ============================================================

const contenedorVender = document.getElementById("seccion-vender");

function mostrarSeccionVender() {
    contenedorVender.innerHTML = "";

    const claves = Object.keys(partida.inventario);

    if (claves.length === 0) {
        contenedorVender.innerHTML = "<p style='color:white;'>No tienes semillas para vender.</p>";
        return;
    }

    claves.forEach(nombre => {
        const cantidad     = partida.inventario[nombre];
        const datosSemilla = semillas.find(s => s.nombre === nombre);
        if (!datosSemilla) return;

        const card = document.createElement("div");
        card.className = "semilla-card";

        card.innerHTML = `
            <h3>${datosSemilla.emoji} ${nombre}</h3>
            <p>Cantidad: <strong>x${cantidad}</strong></p>
            <p>Precio venta: <strong>$${datosSemilla.venta}</strong></p>
            <button class="btn-vender" data-nombre="${nombre}" data-venta="${datosSemilla.venta}">
                Vender 1
            </button>
        `;

        contenedorVender.appendChild(card);
    });

    // Evento para cada botón de vender
    document.querySelectorAll(".btn-vender").forEach(btn => {
        btn.addEventListener("click", function () {
            const nombre = this.dataset.nombre;
            const venta  = parseInt(this.dataset.venta);

            if (partida.inventario[nombre] > 0) {
                partida.inventario[nombre]--;
                if (partida.inventario[nombre] === 0) delete partida.inventario[nombre];

                partida.dinero += venta;
                spanDinero.textContent = partida.dinero;

                guardarPartida();
                mostrarSeccionVender(); // Redibujamos la sección
                alert(`✅ Vendiste 1x ${nombre} por $${venta}`);
            }
        });
    });
}

// Mostramos la sección al cargar
mostrarSeccionVender();


// ============================================================
// GUARDAR → solo guardamos el objeto partida (granjero)
// El terreno no lo tocamos desde la tienda.
// ============================================================

function guardarPartida() {
    localStorage.setItem("partidaGranja", JSON.stringify(partida));
}


// ============================================================
// BOTÓN VOLVER AL JUEGO
// ============================================================

document.getElementById("volver").addEventListener("click", () => {
    window.location.href = "juego.html";
});
