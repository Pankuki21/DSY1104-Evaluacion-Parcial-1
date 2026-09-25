// VALIDACION FORMULARIO DE CONTACTO //
const formularioContacto = document.getElementById("form-contacto");
if (formularioContacto){
    const nombre = document.getElementById("nombre-contacto");
    const email = document.getElementById("email-contacto");
    const mensaje = document.getElementById("texto-mensaje-contacto");
    const contadorMensaje = document.getElementById("contador-mensaje");

    const errorNombre = document.getElementById("error-nombre-contacto");
    const errorEmail = document.getElementById("error-email-contacto");
    const errorMensaje = document.getElementById("error-mensaje-contacto");

    const mensajeContacto = document.getElementById("mensaje-contacto");

    //Validar nombre
    function validarNombre(){
        if (nombre.value.trim() === ""){
            errorNombre.textContent = "El nombre es obligatorio";
            return false;
        }

        if(nombre.value.length > 100){
            errorNombre.textContent = "El nombre no puede superar los 100 caracteres";
            return false;
        }
        errorNombre.textContent = "";
        return true;
    }

    //validar email
    function validarEmail(){
        if (email.value.trim() === ""){
            errorEmail.textContent = "El correo es obligatorio";
            return false;
        }
        
        if (email.value.length > 100){
            errorEmail.textContent = "el correo electrónico no puede superar los 100 caracteres";
            return false;
        }
        
        const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
        let correoValido = false
        
        for (let dominio of dominiosPermitidos){
            if (email.value.endsWith(dominio)){
                correoValido = true;
            }
        }
        if (!correoValido){
            errorEmail.textContent = "El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com";
            return false;
        }
        errorEmail.textContent = "";
        return true;
    }

    //validar mensaje
    function validarMensaje() {
        contadorMensaje.textContent = mensaje.value.length + "/500";
        
        if (mensaje.value.trim() === "") {
            errorMensaje.textContent = "El mensaje es obligatorio";
            return false;
        }

        if (mensaje.value.length > 500) {
            errorMensaje.textContent = "El mensaje no puede superar los 500 caracteres";
            return false;
        }
        errorMensaje.textContent = "";
        return true;
    }

    //Validacion en tiempo real
    nombre.addEventListener("input", validarNombre);
    email.addEventListener("input", validarEmail);
    mensaje.addEventListener("input", validarMensaje);

    //Enviar formulario
    formularioContacto.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombreValido = validarNombre();
        const emailValido = validarEmail();
        const mensajeValido = validarMensaje();
        
        //Mostrar mensaje de exito al enviar
        if (nombreValido && emailValido && mensajeValido) {
            mensajeContacto.textContent = "Mensaje enviado correctamente";
            formularioContacto.reset();
            
            contadorMensaje.textContent = "0/500";
        } else{
            mensajeContacto.textContent = "";
        }
     });
}

//VALIDACION REGSITRO
const datosRegionesRegistro = [
    { region: "Metropolitana", comunas: ["Santiago", "Maipú", "Providencia", "Las Condes"] },
    { region: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Concón"] },
    { region: "Biobío", comunas: ["Concepción", "Talcahuano", "San Pedro"] }
];

const formularioRegistro = document.getElementById("form-registro");

if (formularioRegistro) {
    const region = document.getElementById("region");
    const comuna = document.getElementById("comuna");

    for (let item of datosRegionesRegistro) {
        const opcion = document.createElement("option");

        opcion.value = item.region;
        opcion.textContent = item.region;
        region.appendChild(opcion);
    }
    region.addEventListener("change", function() {

        comuna.innerHTML = '<option value="">Seleccione Comuna</option>';
        for (let item of datosRegionesRegistro) {
            if (item.region === region.value) {
                for (let nombreComuna of item.comunas) {
                    const opcion = document.createElement("option");
                    opcion.value = nombreComuna;
                    opcion.textContent = nombreComuna;
                    comuna.appendChild(opcion);
                }
            }
        }
    });

    formularioRegistro.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const run = document.getElementById("run").value.trim().toUpperCase();
        const nombre = document.getElementById("nombre").value.trim();
        const apellidos = document.getElementById("apellidos").value.trim();
        const email = document.getElementById("email").value.trim();
        const fechaNac = document.getElementById("fechaNac").value;
        const direccion = document.getElementById("direccion").value.trim();
        const password = document.getElementById("password").value;

        if (!validarRUNRegistro(run)) {
            alert("Ingrese un RUN válido, sin puntos ni guion");
            return;
        }

        if (nombre === "" || nombre.length > 50) {
            alert("Ingrese un nombre válido");
            return;
        }

        if (apellidos === "" || apellidos.length > 100) {
            alert("Ingrese apellidos válidos");
            return;
        }

        if (!esEmailRegistroValido(email)) {
            alert("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com");
            return;
        }

        if (region.value === "" || comuna.value === "") {
            alert("Debe seleccionar región y comuna");
            return;
        }

        if (direccion === "" || direccion.length > 300) {
            alert("Ingrese una dirección válida");
            return;
        }

        if (password === "") {
            alert("La contraseña es obligatoria");
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        for (let usuario of usuarios) {

            if (usuario.run === run) {
                alert("Ya existe un usuario con ese RUN");
                return;
            }
        }

        const nuevoUsuario = { run: run, nombre: nombre, apellidos: apellidos,
            email: email, fechaNac: fechaNac, tipo: "Cliente", region: region.value,
            comuna: comuna.value, direccion: direccion, password: password};

        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert("Cuenta creada correctamente");
        formularioRegistro.reset();
        window.location.href = "inicio-sesion.html";
    });
}

function validarRUNRegistro(run) {
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
    const digito = run.slice(-1);
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador++;
        if (multiplicador > 7) {
            multiplicador = 2;
        }
    }

    const resultado = 11 - (suma % 11);
    let esperado;

    if (resultado === 11) {
        esperado = "0";
    } else if (resultado === 10) {
        esperado = "K";
    } else {
        esperado = String(resultado);
    }
    return digito === esperado;
}

function esEmailRegistroValido(email) {
    return email.endsWith("@duoc.cl") ||
           email.endsWith("@profesor.duoc.cl") ||
           email.endsWith("@gmail.com");

}

// Admin inicial
let usuariosIniciales = JSON.parse(localStorage.getItem("usuarios")) || [];

let  adminExiste = false;

for(let usuario of usuariosIniciales){
    if (usuario.email === "admin@duoc.cl"){ adminExiste = true;}
}

if (!adminExiste){
    usuariosIniciales.push({
        email: "admin@duoc.cl",
        password: "Admin123",
        tipo: "Admin"
    });

localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));    
}

//VALIDACION DE LOGIN
const formularioLogin = document.getElementById("form-login");
if (formularioLogin) {
    formularioLogin.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const email = document.getElementById("email-login").value.trim();
        const password = document.getElementById("password-login").value;
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        let usuarioEncontrado = null;

        for (let usuario of usuarios) {
            if (usuario.email === email && usuario.password === password) {
                usuarioEncontrado = usuario;
            }
        }
        if (!usuarioEncontrado) {
            alert("Correo o contraseña incorrectos");
            return;
        }

        localStorage.setItem(
            "usuarioActual",
            JSON.stringify(usuarioEncontrado)
        );

        if (usuarioEncontrado.tipo === "Cliente") {
            window.location.href = "home.html";
        } else {
            window.location.href = "../admin/inicio.html";
        }
    });
}