// Arreglo de productos
const productos = [
    {
        codigo: "PR001",
        nombre: "Mesa de comedor 6 puestos",
        categoria: "Muebles",
        material: "Madera de roble",
        tiempo: 8,
        precio: 250000,
        stock: 25,
        imagen: "mesa-comedor.jpg"
    },
    {
        codigo: "PR002",
        nombre: "Silla de comedor",
        categoria: "Muebles",
        material: "Madera de pino",
        tiempo: 3,
        precio: 65000,
        stock: 120,
        imagen: "silla-comedor.jpg"
    },
    {
        codigo: "PR003",
        nombre: "Escritorio ejecutivo",
        categoria: "Oficina",
        material: "Madera de nogal",
        tiempo: 10,
        precio: 380000,
        stock: 15,
        imagen: "escritorio-ejecutivo.jpg"
    },
    {
        codigo: "PR004",
        nombre: "Estantería de oficina",
        categoria: "Oficina",
        material: "Madera de pino",
        tiempo: 6,
        precio: 180000,
        stock: 30,
        imagen: "estanteria-oficina.jpg"
    },
    {
        codigo: "PR005",
        nombre: "Ropero con espejo",
        categoria: "Muebles",
        material: "Madera de roble",
        tiempo: 12,
        precio: 420000,
        stock: 10,
        imagen: "ropero-espejo.jpg"
    },
    {
        codigo: "PR006",
        nombre: "Mesón de cocina",
        categoria: "Muebles",
        material: "Madera de nogal",
        tiempo: 14,
        precio: 520000,
        stock: 8,
        imagen: "encimera-cocina.jpg"
    }
];

// Mostrar productos
function mostrarProductos() {
    const lista = document.getElementById("lista-productos");
    if (!lista) {
        return;
    }

    for (let producto of productos) {
        const columna = document.createElement("div");
        columna.className = "col-md-4";
        const tarjeta = document.createElement("article");
        tarjeta.className = "card h-100";

        // Imagen del producto
        const imagen = document.createElement("img");
        imagen.src = "../img/productos/" + producto.imagen;
        imagen.alt = producto.nombre;
        imagen.className = "card-img-top";
        const cuerpo = document.createElement("div");
        cuerpo.className = "card-body";

        // Nombre
        const nombre = document.createElement("h2");
        nombre.className = "card-title";
        nombre.textContent = producto.nombre;

        // Precio
        const precio = document.createElement("p");
        precio.className = "card-text";
        precio.textContent = "Precio: $" + producto.precio;

        // Botón ver producto
        const botonVer = document.createElement("a");
        botonVer.className = "btn btn-secondary me-2";
        botonVer.textContent = "Ver producto";
        botonVer.href = "producto-" + producto.codigo.toLowerCase() + ".html";

        // Botón agregar al carrito
        const botonCarrito = document.createElement("button");
        botonCarrito.className = "btn btn-primary";
        botonCarrito.textContent = "Agregar al carrito";

        botonCarrito.addEventListener("click", function () {
            agregarAlCarrito(producto, botonCarrito);
        });

        cuerpo.appendChild(nombre);
        cuerpo.appendChild(precio);
        cuerpo.appendChild(botonVer);
        cuerpo.appendChild(botonCarrito);
        tarjeta.appendChild(imagen);
        tarjeta.appendChild(cuerpo);
        columna.appendChild(tarjeta);
        lista.appendChild(columna);
    }
}

mostrarProductos();

//Conecta botón
for (let i = 0; i < productos.length; i++) {
    const boton = document.getElementById(
        "agregar-carrito-" + productos[i].codigo.toLowerCase()
    );

    if (boton) {
        boton.addEventListener("click", function () {
            agregarAlCarrito(productos[i], boton);
        });
    }
}