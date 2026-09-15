// Arreglo de regiones y comunas
const datosRegiones = [
  { region: "Metropolitana", comunas: ["Santiago", "Maipú", "Providencia", "Las Condes"] },
  { region: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Concón"] },
  { region: "Biobío", comunas: ["Concepción", "Talcahuano", "San Pedro"] }
];

// Lectura de sesión activa
let usuarioLogueado = null;
try {
  usuarioLogueado = JSON.parse(localStorage.getItem("usuarioSesion"));
} catch (e) {
  usuarioLogueado = null;
}

const rutaActual = window.location.pathname.toLowerCase();
const esPaginaPublica = rutaActual.includes("registro") || rutaActual.includes("inicio-sesion");

// Proteger únicamente el panel de administración
if (!esPaginaPublica) {
  if (!usuarioLogueado) {
    window.location.href = "../tienda/inicio-sesion.html";
  } else if (usuarioLogueado.tipo === "Cliente") {
    alert("Los clientes no tienen permiso para ingresar al panel de administración.");
    window.location.href = "../tienda/inicio-sesion.html";
  } else if (usuarioLogueado.tipo === "Vendedor" && rutaActual.includes("usuarios")) {
    alert("Acceso denegado: El rol Vendedor solo administra productos.");
    window.location.href = "inicio.html";
  }
}

function cargarRegiones() {
  const selectReg = document.getElementById("region");
  if (!selectReg) return;

  let html = '<option value="">Seleccione Región</option>';
  datosRegiones.forEach(item => {
    html += `<option value="${item.region}">${item.region}</option>`;
  });
  selectReg.innerHTML = html;
}

function cargarComunas() {
  const selectReg = document.getElementById("region");
  const selectCom = document.getElementById("comuna");
  if (!selectReg || !selectCom) return;

  const regionSel = selectReg.value;
  let html = '<option value="">Seleccione Comuna</option>';

  const regionEncontrada = datosRegiones.find(item => item.region === regionSel);
  if (regionEncontrada) {
    regionEncontrada.comunas.forEach(comuna => {
      html += `<option value="${comuna}">${comuna}</option>`;
    });
  }
  selectCom.innerHTML = html;
}

function inicializar() {
  const lblUser = document.getElementById("nombreUsuario");
  if (lblUser && usuarioLogueado) lblUser.textContent = usuarioLogueado.nombre;

  const menuUsuarios = document.getElementById("menuUsuarios");
  if (menuUsuarios && usuarioLogueado && usuarioLogueado.tipo === "Vendedor") {
    menuUsuarios.style.display = "none";
  }

  cargarRegiones();

  const selectReg = document.getElementById("region");
  if (selectReg) {
    selectReg.onchange = cargarComunas;
  }

  if (document.getElementById("tablaUsuarios")) listarUsuarios();
  if (document.getElementById("tablaProductos")) listarProductos();
}

// Carga forzada instantánea para evitar pantallas en blanco
inicializar();
window.addEventListener("DOMContentLoaded", inicializar);

function cerrarSesion() {
  localStorage.removeItem("usuarioSesion");
  window.location.href = "../tienda/inicio-sesion.html";
}

function esEmailValido(email) {
  return email.endsWith("@duoc.cl") || email.endsWith("@profesor.duoc.cl") || email.endsWith("@gmail.com");
}

function guardarUsuario(e) {
  e.preventDefault();

  const run = document.getElementById("run").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const email = document.getElementById("email").value.trim();
  const fechaNac = document.getElementById("fechaNac").value;
  const tipo = document.getElementById("tipo") ? document.getElementById("tipo").value : "Cliente";
  const region = document.getElementById("region").value;
  const comuna = document.getElementById("comuna").value;
  const direccion = document.getElementById("direccion").value.trim();
  const password = document.getElementById("password") ? document.getElementById("password").value : "123456";

  if (!/^\d{7,9}$/.test(run)) return alert("El RUN debe contener solo números (7 a 9 dígitos, sin puntos ni guion).");
  if (!nombre || nombre.length > 50) return alert("El Nombre es obligatorio (máx 50 caracteres).");
  if (!apellidos || apellidos.length > 100) return alert("Los Apellidos son obligatorios (máx 100 caracteres).");
  if (!email || email.length > 100 || !esEmailValido(email)) return alert("El Email solo acepta dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.");
  if (!region || !comuna) return alert("Debe seleccionar Región y Comuna.");
  if (!direccion || direccion.length > 300) return alert("La Dirección es obligatoria (máx 300 caracteres).");

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const index = usuarios.findIndex(u => u.run === run);
  const nuevoUsuario = { run, nombre, apellidos, email, fechaNac, tipo, region, comuna, direccion, password };

  if (index !== -1) {
    usuarios[index] = nuevoUsuario;
    alert("Usuario actualizado correctamente.");
  } else {
    usuarios.push(nuevoUsuario);
    alert("Usuario registrado con éxito.");
  }

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  document.getElementById("formUsuario").reset();
  if (document.getElementById("tablaUsuarios")) listarUsuarios();
}

function listarUsuarios() {
  const tbody = document.querySelector("#tablaUsuarios tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  usuarios.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.run}</td>
        <td>${u.nombre} ${u.apellidos}</td>
        <td>${u.email}</td>
        <td>${u.tipo}</td>
        <td>${u.comuna}, ${u.region}</td>
        <td><button onclick="eliminarUsuario('${u.run}')">Eliminar</button></td>
      </tr>`;
  });
}

function eliminarUsuario(run) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios = usuarios.filter(u => u.run !== run);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  listarUsuarios();
}

function guardarProducto(e) {
  e.preventDefault();

  const id = document.getElementById("prodId").value.trim();
  const nombre = document.getElementById("prodNombre").value.trim();
  const precio = document.getElementById("prodPrecio").value;
  const stock = parseInt(document.getElementById("prodStock").value);
  const imagenInput = document.getElementById("prodImagen").value.trim();
  const imagen = imagenInput !== "" ? imagenInput : "https://via.placeholder.com/150";

  if (!id || !nombre || !precio || isNaN(stock)) {
    return alert("Todos los campos del producto son obligatorios.");
  }

  if (stock < 5) {
    alert("¡ALERTA CRÍTICA! El stock de esta prenda es inferior a 5 unidades.");
  }

  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  const index = productos.findIndex(p => p.id === id);
  const nuevoProducto = { id, nombre, precio, stock, imagen };

  if (index !== -1) {
    productos[index] = nuevoProducto;
    alert("Prenda/Producto actualizado.");
  } else {
    productos.push(nuevoProducto);
    alert("Prenda/Producto agregado al inventario.");
  }

  localStorage.setItem("productos", JSON.stringify(productos));
  document.getElementById("formProducto").reset();
  listarProductos();
}

function listarProductos() {
  const tbody = document.querySelector("#tablaProductos tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  const productos = JSON.parse(localStorage.getItem("productos")) || [];

  productos.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>
          <img src="${p.imagen}" class="img-producto" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/150';">
        </td>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>$${p.precio}</td>
        <td>${p.stock} ${p.stock < 5 ? '<b style="color:red;">(Bajo Stock)</b>' : ''}</td>
        <td><button onclick="eliminarProducto('${p.id}')">Eliminar</button></td>
      </tr>`;
  });
}

function eliminarProducto(id) {
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  productos = productos.filter(p => p.id !== id);
  localStorage.setItem("productos", JSON.stringify(productos));
  listarProductos();
}
