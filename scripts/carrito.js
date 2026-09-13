// Obtener el carrito guardado
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Guardar el carrito
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar un producto al carrito
function agregarAlCarrito(producto, boton) {
    let productoExistente = carrito.find(function (item) {
        return item.codigo === producto.codigo;
    });

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }
    guardarCarrito();
    if (boton){
        boton.textContent = "Agregado al carrito";
    }
}

// Eliminar un producto
function eliminarDelCarrito(codigo) {
    carrito = carrito.filter(function (producto) {
        return producto.codigo !== codigo;
    });

    guardarCarrito();
    mostrarCarrito();
}

// Cambiar cantidad
function cambiarCantidad(codigo, nuevaCantidad) {
    for (let producto of carrito) {
        if (producto.codigo === codigo) {
            producto.cantidad = Number(nuevaCantidad);
            if (producto.cantidad < 1) {
                producto.cantidad = 1;
            }
        }
    }

    guardarCarrito();
    mostrarCarrito();
}

// Mostrar el carrito
function mostrarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const cantidadProductos = document.getElementById("cantidad-productos");

    if (!lista || !totalCarrito || !cantidadProductos) {
        return;
    }
    lista.textContent = "";
    let total = 0;
    let cantidadTotal = 0;
    for (let producto of carrito) {
        const fila = document.createElement("div");
        fila.className = "card mb-3";

        const cuerpo = document.createElement("div");
        cuerpo.className = "card-body";

        const nombre = document.createElement("h2");
        nombre.className = "card-title";
        nombre.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.textContent = "Precio: $" + producto.precio;

        const cantidad = document.createElement("input");
        cantidad.type = "number";
        cantidad.min = "1";
        cantidad.value = producto.cantidad;
        cantidad.className = "form-control mb-2";
        cantidad.style.maxWidth = "100px";

        cantidad.addEventListener("change", function () {
            cambiarCantidad(producto.codigo, cantidad.value);
        });

        const subtotal = document.createElement("p");
        subtotal.textContent =
            "Subtotal: $" + (producto.precio * producto.cantidad);

        const botonEliminar = document.createElement("button");
        botonEliminar.className = "btn btn-danger";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", function () {
            eliminarDelCarrito(producto.codigo);
        });

        cuerpo.appendChild(nombre);
        cuerpo.appendChild(precio);
        cuerpo.appendChild(cantidad);
        cuerpo.appendChild(subtotal);
        cuerpo.appendChild(botonEliminar);

        fila.appendChild(cuerpo);
        lista.appendChild(fila);

        total += producto.precio * producto.cantidad;
        cantidadTotal += producto.cantidad;
    }

    cantidadProductos.textContent = "Cantidad de productos: " + cantidadTotal;
    totalCarrito.textContent = "Total: $" + total;
    if (carrito.length === 0) {
        lista.textContent = "El carrito está vacío.";
    }
}

mostrarCarrito();