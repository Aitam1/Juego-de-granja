// ============================================================
// ARCHIVO: js/clases/Granjero.js
// Clase que representa al jugador.
// Guarda su dinero, energía e inventario de semillas.
// ============================================================

class Granjero {

    constructor(nombre, dificultad, dinero, energia) {
        this.nombre     = nombre;
        this.dificultad = dificultad;
        this.dinero     = dinero;
        this.energia    = energia;

        // El inventario es un objeto que guarda cuántas semillas tiene de cada tipo.
        // Ejemplo: { "Trigo": 3, "Tomate": 1 }
        this.inventario = {};
    }

    // Suma dinero al granjero
    ganarDinero(cantidad) {
        this.dinero += cantidad;
    }

    // Resta dinero si tiene suficiente. Devuelve true si pudo pagar.
    gastarDinero(cantidad) {
        if (this.dinero >= cantidad) {
            this.dinero -= cantidad;
            return true;
        }
        return false; // No tenía suficiente dinero
    }

    // Resta energía si tiene suficiente. Devuelve true si pudo gastar.
    gastarEnergia(cantidad) {
        if (this.energia >= cantidad) {
            this.energia -= cantidad;
            return true;
        }
        return false; // No tenía suficiente energía
    }

    // Suma energía, con un máximo de 100
    recuperarEnergia(cantidad) {
        this.energia = Math.min(this.energia + cantidad, 100);
    }

    // Añade una semilla al inventario
    agregarSemilla(nombre) {
        // Si ya tenía de ese tipo, suma uno; si no, empieza desde 1
        this.inventario[nombre] = (this.inventario[nombre] || 0) + 1;
    }

    // Usa una semilla del inventario al plantar. Devuelve true si tenía.
    usarSemilla(nombre) {
        if (this.inventario[nombre] && this.inventario[nombre] > 0) {
            this.inventario[nombre]--;
            // Si llega a 0, borramos esa entrada del inventario
            if (this.inventario[nombre] === 0) delete this.inventario[nombre];
            return true;
        }
        return false; // No tenía esa semilla
    }
}

export default Granjero;
