// ============================================================
// ARCHIVO: datos/semillas.js
// Aquí guardamos la información de todas las semillas del juego.
// Cada semilla tiene:
//   - nombre:  cómo se llama
//   - emoji:   el símbolo que aparece en la parcela
//   - precio:  cuánto cuesta comprarla en la tienda
//   - venta:   cuánto dinero ganas al cosecharla
//   - tiempo:  segundos que tarda en madurar
// ============================================================

const semillas = [
    { nombre: "Trigo",     emoji: "🌾", precio: 10, venta: 25,  tiempo: 10 },
    { nombre: "Zanahoria", emoji: "🥕", precio: 15, venta: 35,  tiempo: 15 },
    { nombre: "Tomate",    emoji: "🍅", precio: 20, venta: 50,  tiempo: 20 },
    { nombre: "Maíz",      emoji: "🌽", precio: 25, venta: 65,  tiempo: 25 },

    // NUEVA SEMILLA
    { nombre: "Kiwi",      emoji: "🥝", precio: 30, venta: 80,  tiempo: 30 }
];

// Exportamos para poder usarlas en otros archivos
export default semillas;
