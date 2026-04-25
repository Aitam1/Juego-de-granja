// Los filtros XPath — igual que el profe pero con semillas
const filtros = {
    todos:      "//semilla",
    baratas:    "//semilla[precioCompra<20]",
    caras:      "//semilla[precioCompra>15]",
    rapidas:    "//semilla[tiempoMaduracion<20]",
    rentables:  "//semilla[precioVenta>50]"
}

// Carga el XML, lo procesa y aplica el XPath — igual que el profe
async function cargarYProcesarXML(xpath) {
    const response = await fetch("datos.xml");
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");

    const result = xmlDoc.evaluate(
        xpath,
        xmlDoc,
        null,
        XPathResult.ANY_TYPE,
        null
    );

    let node;
    const semillas = [];

    while ((node = result.iterateNext())) {
        semillas.push({
            nombre:          node.querySelector("nombre").textContent,
            emoji:           node.querySelector("emoji").textContent,
            precio:          parseInt(node.querySelector("precioCompra").textContent),
            venta:           parseInt(node.querySelector("precioVenta").textContent),
            tiempo:          parseInt(node.querySelector("tiempoMaduracion").textContent)
        });
    }

    return semillas;
}


// Muestra las tarjetas de semillas en pantalla
function mostrarSemillas(semillas) {
    const contenedor = document.getElementById("seccion-comprar");
    contenedor.innerHTML = "";

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

        contenedor.appendChild(card);
    });
}

// Cuando el usuario cambia el filtro — igual que el profe
document.getElementById("filtro").addEventListener("change", async (e) => {
    const filtro = filtros[e.target.value];
    const semillas = await cargarYProcesarXML(filtro);
    mostrarSemillas(semillas);
});

// Carga todas las semillas al abrir la tienda
(async () => {
    const semillas = await cargarYProcesarXML(filtros.todos);
    mostrarSemillas(semillas);
})();