// ============================================================
// ARCHIVO: js/clases/Cultivo.js
// Clase que representa una planta en una parcela.
// Un cultivo puede estar en 3 estados:
//   "plantado" → está creciendo, no se puede cosechar todavía
//   "listo"    → ya maduró, se puede cosechar
//   "vacio"    → no hay nada (después de cosechar)
// ============================================================

class Cultivo {

    constructor(nombre, emoji, precio, tiempo) {
        this.nombre  = nombre;   // Nombre del cultivo ("Trigo", "Tomate"...)
        this.emoji   = emoji;    // Símbolo visual que se muestra en la parcela
        this.precio  = precio;   // Dinero que ganas al cosechar
        this.tiempo  = tiempo;   // Segundos que tarda en madurar
        this.estado  = "vacio";  // Estado inicial
        this.tiempoPlantado = null; // Guarda el momento exacto en que se plantó
    }

    // Cambia el estado a "plantado" y guarda la hora actual
    // Date.now() devuelve los milisegundos desde 1970 (un número único)
    plantar() {
        this.estado = "plantado";
        this.tiempoPlantado = Date.now();
    }

    // Calcula cuántos segundos faltan para que madure.
    // Esto funciona incluso si cerramos la página y volvemos,
    // porque comparamos la hora actual con cuándo se plantó.
    tiempoRestante() {
        if (!this.tiempoPlantado) return 0;
        const pasado   = (Date.now() - this.tiempoPlantado) / 1000; // segundos pasados
        const restante = this.tiempo - pasado;
        return Math.max(0, Math.round(restante)); // nunca devuelve negativo
    }

    // Devuelve true si el cultivo ya está listo para cosechar
    estaListo() {
        if (this.estado === "listo") return true;
        // También puede estar listo si el tiempo ya pasó aunque el estado no se actualizó
        if (this.estado === "plantado" && this.tiempoRestante() === 0) {
            this.estado = "listo"; // Actualizamos el estado
            return true;
        }
        return false;
    }

    // Cosecha el cultivo y devuelve el dinero ganado.
    // Si se cosecha antes de tiempo, se pierde (devuelve 0).
    cosechar() {
        if (this.estaListo()) {
            this.estado = "vacio";
            return this.precio; // Devuelve el dinero ganado
        }
        // Si no está listo, se pierde el cultivo
        this.estado = "vacio";
        return 0;
    }
}

export default Cultivo;
