// Arreglo de regiones y comunas
const datosRegiones = [
  { region: "Metropolitana", comunas: ["Santiago", "Maipú", "Providencia", "Las Condes"] },
  { region: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Concón"] },
  { region: "Biobío", comunas: ["Concepción", "Talcahuano", "San Pedro"] }
];

// Lectura de sesión activa
let usuarioActual = null;
try {
  usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
} catch (error) {
  usuarioActual= null;
}

const rutaActual = window.location.pathname.toLowerCase();
const esPaginaPublica = rutaActual.includes("registro") || rutaActual.includes("inicio-sesion");

// Usuario actual y proteccion
if (!esPaginaPublica) {
  if (!usuarioActual) {
    window.location.href = "../tienda/inicio-sesion.html";
  } else if (usuarioActual.tipo === "Cliente") {
    alert("Los clientes no tienen permiso para ingresar al panel de administración.");
    window.location.href = "../tienda/home.html";

  } else if (usuarioActual.tipo === "Vendedor" && rutaActual.includes("usuarios")) {
    alert("Acceso denegado: El rol Vendedor solo administra productos.");
    window.location.href = "inicio.html";
  }
}

//Roles y permisos
function tienePermiso(pagina) {
    if (!usuarioActual) {
        return false;
    }
    if (usuarioActual.tipo === "Admin") {
        return true;
    }
    if (usuarioActual.tipo === "Vendedor") {
        if (pagina === "productos") {
            return true;
        }
        if (pagina === "ordenes") {
            return true;
        }
        return false;
    }
    return false;
}

if (!esPaginaPublica && usuarioActual) {
    if (
        rutaActual.includes("usuarios") &&
        !tienePermiso("usuarios")
    ) {
        alert("No tienes permiso para administrar usuarios.");
        window.location.href = "inicio.html";
    }
    if (
        rutaActual.includes("ordenes") &&
        !tienePermiso("ordenes")
    ) {
        alert("No tienes permiso para administrar órdenes.");
        window.location.href = "inicio.html";
    }
}

//Menu del admin
function configurarMenu() {
    const nombreUsuario = document.getElementById("nombreUsuario");
    if (nombreUsuario && usuarioActual) {
        nombreUsuario.textContent = usuarioActual.nombre;
    }
    const menuUsuarios = document.getElementById("menuUsuarios");
    if (menuUsuarios && usuarioActual && usuarioActual.tipo !== "Admin") {
        menuUsuarios.style.display = "none";
    }
}

//Cargar regiones
function cargarRegiones() {
  const selectRegion = document.getElementById("region");
  if (!selectRegion) {
    return;
  }

  selectRegion.innerHTML = '<option value="">Seleccione Región</option>';
  for (let item of datosRegiones) {
        const opcion = document.createElement("option");
        opcion.value = item.region;
        opcion.textContent = item.region;
        selectRegion.appendChild(opcion);
    }
}

//Cargar Comunas
function cargarComunas() {
  const selectRegion = document.getElementById("region");
  const selectComuna = document.getElementById("comuna");
  if (!selectRegion || !selectComuna) {
    return;
  }

  selectComuna.innerHTML = '<option value="">Seleccione Comuna</option>';
    const regionSeleccionada = selectRegion.value;
    for (let item of datosRegiones) {
        if (item.region === regionSeleccionada) {
            for (let comuna of item.comunas) {
                const opcion = document.createElement("option");
                opcion.value = comuna;
                opcion.textContent = comuna;
                selectComuna.appendChild(opcion);
            }
        }
    }
}

//Validar run
function validarRUN(run) {
    run = run.toUpperCase();

    if (run.includes(".") || run.includes("-")) {
        return false;
    }

    if (run.length < 7 || run.length > 9) {
        return false;
    }

    if (!/^[0-9]+[0-9K]$/.test(run)) {
        return false;
    }
    const cuerpo = run.slice(0, -1);
    const digitoVerificador = run.slice(-1);
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador++;
        if (multiplicador > 7) {
            multiplicador = 2;
        }
    }
    const resto = suma % 11;
    const resultado = 11 - resto;
    let digitoEsperado;

    if (resultado === 11) {
        digitoEsperado = "0";
    } else if (resultado === 10) {
        digitoEsperado = "K";
    } else {
        digitoEsperado = String(resultado);
    }
    return digitoVerificador === digitoEsperado;
}

//Validar email
function esEmailValido(email) {
    if (email.length > 100) {
        return false;
    }
    return (email.endsWith("@duoc.cl") ||
        email.endsWith("@profesor.duoc.cl") ||
        email.endsWith("@gmail.com")
    );
}

//Guardar usuario
function guardarUsuario(evento) {
    evento.preventDefault();
    const run = document.getElementById("run").value.trim().toUpperCase();
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const email = document.getElementById("email").value.trim();
    const fechaNac = document.getElementById("fechaNac").value;
    const tipo = document.getElementById("tipo").value;
    const region = document.getElementById("region").value;
    const comuna = document.getElementById("comuna").value;
    const direccion = document.getElementById("direccion").value.trim();
    const password = document.getElementById("password").value;

    // Validar RUN
    if (!validarRUN(run)) {
        alert("Ingrese un RUN válido, sin puntos ni guion");
        return;
    }

    // Validar nombre
    if (nombre === "") {
        alert("El nombre es obligatorio.");
        return;
    }

    if (nombre.length > 50) {
        alert("El nombre no puede superar los 50 caracteres");
        return;
    }

    // Validar apellidos
    if (apellidos === "") {
        alert("Los apellidos son obligatorios");
        return;
    }

    if (apellidos.length > 100) {
        alert("Los apellidos no pueden superar los 100 caracteres");
        return;
    }

    // Validar email
    if (email === "") {
        alert("El correo electrónico es obligatorio");
        return;
    }

    if (!esEmailValido(email)) {
        alert("El correo no tiene un dominio permitido");
        return;
    }

    // Validar tipo de usuario
    if (tipo === "") {
        alert("Debe seleccionar un tipo de usuario");
        return;
    }

    // Validar región y comuna
    if (region === "") {
        alert("Debe seleccionar una región");
        return;
    }

    if (comuna === "") {
        alert("Debe seleccionar una comuna");
        return;
    }

    // Validar dirección
    if (direccion === "") {
        alert("La dirección es obligatoria");
        return;
    }

    if (direccion.length > 300) {
        alert("La dirección no puede superar los 300 caracteres");
        return;
    }

    // Obtener usuarios guardados
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    for (let usuario of usuarios) {
      if (usuario.run === run) {
          alert("Ya existe un usuario con ese RUN.");
          return;
      }
}
    // Crear nuevo usuario
    const nuevoUsuario = {run: run, nombre: nombre, apellidos: apellidos,
                          email: email, fechaNac: fechaNac, tipo: tipo,
                          region: region, comuna: comuna, direccion: direccion,
                          password: password};

    // Agregar usuario
    usuarios.push(nuevoUsuario);

    // Guardar usuarios
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Usuario creado correctamente.");
    document.getElementById("formUsuario").reset();
    listarUsuarios();
}

//Listar usuarios
function listarUsuarios() {
    const tabla = document.querySelector("#tablaUsuarios tbody");
    if (!tabla) {
        return;
    }
    tabla.innerHTML = "";

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    for (let usuario of usuarios) {
        tabla.innerHTML += `
            <tr>
             <td>${usuario.run}</td>
             <td>${usuario.nombre} ${usuario.apellidos}</td>
             <td>${usuario.email}</td>
             <td>${usuario.tipo}</td>
             <td>${usuario.comuna}, ${usuario.region}</td>
             <td>
                <button onclick="eliminarUsuario('${usuario.run}')">
                    Eliminar
                </button>
             </td>
            </tr>
        `;
    }
}

//Eliminar usuario
function eliminarUsuario(run) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].run === run) {
            usuarios.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    listarUsuarios();
}

//Guardar producto
function guardarProducto(evento) {
    evento.preventDefault();
    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = Number(document.getElementById("precio").value);
    const stock = Number(document.getElementById("stock").value);
    const stockCritico = Number(document.getElementById("stock-critico").value);
    const categoria = document.getElementById("categoria").value;
    const imagen = document.getElementById("imagen").value;

    if (codigo.length < 3 || nombre === "" || nombre.length > 100) {
        alert("Ingrese un código válido y un nombre válido");
        return;
    }
    if (descripcion.length > 500 || precio < 0 || stock < 0 || stockCritico < 0) {
        alert("Revise los datos ingresados");
        return;
    }
    if (categoria === "") {
        alert("Debe seleccionar una categoría");
        return;
    }
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let encontrado = false;

    for (let producto of productos) {
        if (producto.codigo === codigo) {
            producto.nombre = nombre;
            producto.descripcion = descripcion;
            producto.precio = precio;
            producto.stock = stock;
            producto.stockCritico = stockCritico;
            producto.categoria = categoria;
            producto.imagen = imagen;
            encontrado = true;
        }
    }

    if (!encontrado) {
      productos.push({
        codigo: codigo, nombre: nombre, descripcion: descripcion,
        precio: precio, stock: stock, stockCritico: stockCritico,
        categoria: categoria, imagen: imagen});
      alert("Producto creado correctamente");
    } else {
      alert("Producto actualizado correctamente.");
    }

    localStorage.setItem("productos", JSON.stringify(productos));
    document.getElementById("form-producto").reset();
    listarProductos();
}

// Listar productos

function listarProductos() {
  const tabla = document.querySelector("#lista-productos-admin");

  if (!tabla) return;
  tabla.innerHTML = "";

  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  for (let producto of productos) {
    let alerta = "";
      if (producto.stock <= producto.stockCritico) {
          alerta = "Stock crítico";
      }
      tabla.innerHTML += `
        <tr>
            <td>${producto.codigo}</td>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>$${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>${alerta}</td>
            <td>
                <button onclick="editarProducto('${producto.codigo}')">
                  Editar
                </button>
                <button onclick="eliminarProducto('${producto.codigo}')">
                  Eliminar
                </button>
            </td>
        </tr>
      `;
    }
}

//Editar producto
function editarProducto(codigo) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    for (let producto of productos) {
        if (producto.codigo === codigo) {
            document.getElementById("codigo").value = producto.codigo;
            document.getElementById("nombre").value = producto.nombre;
            document.getElementById("descripcion").value = producto.descripcion;
            document.getElementById("precio").value = producto.precio;
            document.getElementById("stock").value = producto.stock;
            document.getElementById("stock-critico").value = producto.stockCritico;
            document.getElementById("categoria").value = producto.categoria;
            break;
        }
    }
}

//Eliminar producto
function eliminarProducto(codigo) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].codigo === codigo) {
            productos.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("productos", JSON.stringify(productos));
    listarProductos();
}

//Cerrar sesion
function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    window.location.href = "../tienda/inicio-sesion.html";
}

//Inicializar
function inicializar() {
    configurarMenu();
    cargarRegiones();

    const region = document.getElementById("region");
    if (region) {
        region.addEventListener("change", cargarComunas);
    }
    const formularioUsuario = document.getElementById("formUsuario");
    if (formularioUsuario) {
        formularioUsuario.addEventListener("submit", guardarUsuario);
    }
    const formularioProducto = document.getElementById("form-producto");
    if (formularioProducto) {
        formularioProducto.addEventListener("submit", guardarProducto);
    }
    
    listarUsuarios();
    listarProductos();
}

window.addEventListener("DOMContentLoaded", inicializar);


