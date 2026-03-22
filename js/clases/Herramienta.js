// ============================================================
// ARCHIVO: js/clases/Herramienta.js
// Clase que representa una herramienta del granjero.
// Cada herramienta tiene 3 niveles: Básica, Mejorada, Maestra.
// Al mejorarla se paga dinero y el efecto aumenta.
// ============================================================

class Herramienta {

    // niveles es un array con los datos de cada nivel.
    // Ejemplo para la Azada:
    // [ {nombre:"Básica", costo:0, efecto:1.0}, {nombre:"Mejorada", costo:80, efecto:1.3}, ... ]
    constructor(nombre, emoji, niveles) {
        this.nombre      = nombre;
        this.emoji       = emoji;
        this.niveles     = niveles;
        this.nivelActual = 0; // Empezamos siempre en nivel 0 (Básica)
    }

    // Devuelve el efecto del nivel actual (multiplicador)
    efecto() {
        return this.niveles[this.nivelActual].efecto;
    }

    // Devuelve el nombre del nivel actual ("Básica", "Mejorada", "Maestra")
    nombreNivel() {
        return this.niveles[this.nivelActual].nombre;
    }

    // Devuelve cuánto cuesta el siguiente nivel (null si ya es el máximo)
    costoMejora() {
        if (this.nivelActual >= this.niveles.length - 1) return null;
        return this.niveles[this.nivelActual + 1].costo;
    }

    // Sube un nivel si no estamos al máximo. Devuelve true si se mejoró.
    mejorar() {
        if (this.nivelActual < this.niveles.length - 1) {
            this.nivelActual++;
            return true;
        }
        return false;
    }
}

export default Herramienta;
