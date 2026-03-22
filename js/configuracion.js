// ============================================================
// ARCHIVO: js/configuracion.js
// Controla el formulario de nueva partida.
// Valida los datos y los guarda en localStorage.
// ============================================================

const formulario  = document.getElementById("form-configuracion");
const inputNombre = document.getElementById("nombre-granjero");
const selectDif   = document.getElementById("dificultad");
const inputDinero = document.getElementById("dinero");
const inputEnerg  = document.getElementById("energia");
const spanError   = document.getElementById("mensaje-error");

// Cuando el jugador cambia la dificultad, actualizamos los
// valores sugeridos de dinero y energía automáticamente
selectDif.addEventListener("change", () => {
    if (selectDif.value === "facil") {
        inputDinero.value = 200;
        inputEnerg.value  = 80;
    } else if (selectDif.value === "normal") {
        inputDinero.value = 100;
        inputEnerg.value  = 50;
    } else if (selectDif.value === "dificil") {
        inputDinero.value = 40;
        inputEnerg.value  = 25;
    }
});

// Al enviar el formulario validamos todo antes de guardar
formulario.addEventListener("submit", function (e) {
    e.preventDefault(); // Evitamos que la página se recargue

    const nombre     = inputNombre.value.trim();
    const dificultad = selectDif.value;
    const dinero     = parseInt(inputDinero.value);
    const energia    = parseInt(inputEnerg.value);

    // --- Validaciones ---

    if (!nombre) {
        spanError.textContent = "⚠️ Escribe tu nombre.";
        return;
    }
    if (nombre.length < 2) {
        spanError.textContent = "⚠️ El nombre debe tener al menos 2 letras.";
        return;
    }
    if (!dificultad) {
        spanError.textContent = "⚠️ Selecciona una dificultad.";
        return;
    }
    if (isNaN(dinero) || dinero < 10 || dinero > 1000) {
        spanError.textContent = "⚠️ El dinero debe estar entre 10 y 1000.";
        return;
    }
    if (isNaN(energia) || energia < 10 || energia > 100) {
        spanError.textContent = "⚠️ La energía debe estar entre 10 y 100.";
        return;
    }

    // Si todo está bien, ocultamos el error
    spanError.textContent = "";

    // Creamos el objeto con los datos del jugador
    const partida = {
        nombre:     nombre,
        dificultad: dificultad,
        dinero:     dinero,
        energia:    energia,
        inventario: {} // Inventario vacío al empezar
    };

    // Borramos un terreno anterior por si quedó de otra partida
    localStorage.removeItem("terreno");

    // Guardamos la partida en localStorage como texto JSON
    localStorage.setItem("partidaGranja", JSON.stringify(partida));

    // Vamos al juego
    window.location.href = "juego.html";
});
