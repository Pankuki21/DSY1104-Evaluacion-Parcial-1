const productos = [
    {
        codigo: "PR001",
        nombre: "Mesa de comedor 6 puestos",
        categoria: "Muebles",
        material: "Madera de roble",
        horasProduccion: 8,
        precio: 250000,
        stock: 25
    },
    {
        codigo: "PR002",
        nombre: "Silla de comedor",
        categoria: "Muebles",
        material: "Madera de pino",
        horasProduccion: 3,
        precio: 65000,
        stock: 120
    },
    {
        codigo: "PR003",
        nombre: "Escritorio ejecutivo",
        categoria: "Oficina",
        material: "Madera de nogal",
        horasProduccion: 10,
        precio: 380000,
        stock: 15
    },
    {
        codigo: "PR004",
        nombre: "Estantería de oficina",
        categoria: "Oficina",
        material: "Madera de pino",
        horasProduccion: 6,
        precio: 180000,
        stock: 30
    },
    {
        codigo: "PR005",
        nombre: "Ropero con espejo",
        categoria: "Muebles",
        material: "Madera de roble",
        horasProduccion: 12,
        precio: 420000,
        stock: 10
    },
    {
        codigo: "PR006",
        nombre: "Mesón de cocina",
        categoria: "Muebles",
        material: "Madera de nogal",
        horasProduccion: 14,
        precio: 520000,
        stock: 8
    }
];

function mostrarProductos() {
    const contenedor = document.getElementById("lista-productos");
    if (!contenedor) {
        return;
    }

    productos.forEach(producto => {
        const columna = document.createElement("div");
        columna.classList.add("col-md-4");

        const tarjeta = document.createElement("article");
        tarjeta.classList.add("card", "h-100");

        tarjeta.innerHTML = `
            <img
                src="../img/productos/${producto.codigo}.jpg"
                class="card-img-top"
                alt="${producto.nombre}">

            <div class="card-body">
                <h3 class="card-title">
                    ${producto.nombre}
                </h3>
                <p class="card-text">
                    ${producto.material}
                </p>
                <p class="card-text">
                    <strong>$${producto.precio.toLocaleString("es-CL")}</strong>
                </p>
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="verDetalle('${producto.codigo}')">
                    Ver producto
                </button>
                <button
                    type="button"
                    class="btn btn-success"
                    onclick="agregarAlCarrito('${producto.codigo}')">
                    Agregar al carrito
                </button>
            </div>
        `;

        columna.appendChild(tarjeta);
        contenedor.appendChild(columna);
    });
}

mostrarProductos();