// ============================================================
// ARCHIVO: js/menu.js
// Controla los botones del menú principal.
// ============================================================

// Seleccionamos los 4 botones del HTML por su ID
const btnNueva    = document.getElementById("nueva-partida");
const btnContinuar = document.getElementById("continuar-partida");
const btnEliminar = document.getElementById("eliminar-partida");
const btnGitHub   = document.getElementById("github");

// Si no hay partida guardada, desactivamos "Continuar" y "Eliminar"
if (!localStorage.getItem("partidaGranja")) {
    btnContinuar.disabled = true;
    btnEliminar.disabled  = true;
}

// Botón Nueva Partida → va a la pantalla de configuración
btnNueva.addEventListener("click", () => {
    window.location.href = "configuracion.html";
});

// Botón Continuar → solo si hay partida guardada
btnContinuar.addEventListener("click", () => {
    if (localStorage.getItem("partidaGranja")) {
        window.location.href = "juego.html";
    } else {
        alert("No hay partida guardada.");
    }
});

// Botón Eliminar → pide confirmación antes de borrar
btnEliminar.addEventListener("click", () => {
    const confirmar = confirm("¿Seguro que quieres eliminar la partida?");
    if (confirmar) {
        localStorage.removeItem("partidaGranja"); // Borra datos del jugador
        localStorage.removeItem("terreno");       // Borra el estado del terreno
        alert("Partida eliminada.");
        btnContinuar.disabled = true;
        btnEliminar.disabled  = true;
    }
});

// Botón GitHub → abre el repositorio en una nueva pestaña
btnGitHub.addEventListener("click", () => {
    window.open("https://github.com/Aitam1/Juego-de-granja", "_blank");
});
