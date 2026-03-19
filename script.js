// ============================
// PEDIR PERMISO NOTIFICACIONES
// ============================
if ("Notification" in window) {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

function mostrarNotificacion(titulo, mensaje) {

  const sonido = document.getElementById("soundAdd");

  if (sonido) {
    sonido.currentTime = 0;
    sonido.play().catch(()=>{});
  }

  if (Notification.permission === "granted") {

    new Notification(titulo,{
      body: mensaje,
      icon: "./img/icono-192.png"
    });

  }
}

// ============================
// CARRITO
// ============================

let carrito  = JSON.parse(localStorage.getItem("carrito")) || {};
let total    = parseInt(localStorage.getItem("total")) || 0;
let contador = parseInt(localStorage.getItem("contador")) || 0;

actualizarUI();

function agregarCarrito(nombre, precio, imagen){

  if(carrito[nombre]){
    carrito[nombre].cantidad++;
  } else {
    carrito[nombre] = {precio, cantidad:1, imagen};
  }

  total += precio;
  contador++;

  guardarStorage();
  actualizarUI();

  document.getElementById("carritoLista").classList.remove("hidden");

  mostrarNotificacion(
    "Producto agregado 🍧",
    nombre + " fue agregado al carrito"
  );
const audio = document.getElementById("soundAdd");

if(audio){
audio.pause();
audio.currentTime = 0;
audio.play().catch(()=>{});
}
}

function quitarProducto(nombre){

  if(!carrito[nombre]) return;

  total -= carrito[nombre].precio;
  contador--;

  carrito[nombre].cantidad--;

  if(carrito[nombre].cantidad <= 0){
    delete carrito[nombre];
  }

  guardarStorage();
  actualizarUI();
}

function vaciarCarrito(){

  carrito = {};
  total = 0;
  contador = 0;

  guardarStorage();
  actualizarUI();
}

function guardarStorage(){

  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("total", total);
  localStorage.setItem("contador", contador);

}

function actualizarUI(){

  document.getElementById("total").textContent = total;
  document.getElementById("contador").textContent = contador;

  const items = document.getElementById("items");

  items.innerHTML = "";

  for(let nombre in carrito){

    const div = document.createElement("div");

    div.className = "item-carrito";

    div.innerHTML = `
      <img src="${carrito[nombre].imagen}">
      <span>${carrito[nombre].cantidad}x ${nombre}</span>
      <button onclick="quitarProducto('${nombre}')">x</button>
    `;

    items.appendChild(div);

  }

}

// ============================
// FILTROS
// ============================

function filtrar(sabor){

  document.querySelectorAll(".card").forEach(card=>{

    card.style.display =
      (sabor==="all" || card.dataset.sabor===sabor)
      ? "block"
      : "none";

  });

}

// ============================
// TOGGLE CARRITO
// ============================

function toggleCarrito(){
  const carrito = document.getElementById("carritoLista");
  carrito.classList.toggle("hidden");


document.getElementById("btnCarrito")
.addEventListener("click", ()=>{

});
}

// ============================
// ENVIAR PEDIDO WHATSAPP
// ============================

function enviarPedido(){

  if(contador===0){
    alert("Agrega productos primero 🙂");
    return;
  }

  let msg = "Hola, quiero pedir:%0A%0A";

  for(let n in carrito){

    msg += `${carrito[n].cantidad}x ${n}%0A`;

  }

  msg += `%0ATotal: $${total}`;

  window.open(
    `https://wa.me/573104224157?text=${msg}`,
    "_blank"
  );

}

// ============================
// FORMULARIO
// ============================

const scriptURL = "https://script.google.com/macros/s/AKfycbzFrREWEeyUEfQgldRrhvHLJQOCcVp-m594OUpWw-arZvLoqx20LZBfKi5CfDONw1mc/exec";

document.getElementById("pedidoForm").addEventListener("submit", e => {

  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre").value,
    telefono: document.getElementById("telefono").value,
    producto: document.getElementById("producto").value,
    topping: document.getElementById("Topping").value,
    chupeta: document.getElementById("Chupeta").value,
    mensaje: document.getElementById("Mensaje").value
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(() => {
    alert("Pedido enviado correctamente 😊");
    document.getElementById("pedidoForm").reset();
  })
  .catch(err => console.error("Error:", err));

});

// ============================
// BOTON INSTALAR APP
// ============================

let deferredPrompt;

const botonInstalar = document.getElementById("btnInstalar");

window.addEventListener("beforeinstallprompt",(e)=>{

  e.preventDefault();

  deferredPrompt = e;

  botonInstalar.style.display = "block";

});

botonInstalar.addEventListener("click", async ()=>{

  botonInstalar.style.display="none";

  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;

  if(outcome==="accepted"){
    console.log("App instalada");
  } else {
    console.log("Instalación cancelada");
  }

  deferredPrompt = null;

});

// ============================
// SPLASH
// ============================

window.addEventListener("load", function(){

  const splash = document.getElementById("splash");

  setTimeout(function(){

    if(splash){
      splash.style.display = "none";
    }

  },1500);

});

//==============================
//CLICK PARA CERRAR CARRITO 
//==============================

document.addEventListener("click", function(e){

const carrito = document.getElementById("carritoLista");
const boton = document.getElementById("btnCarrito");

if(!carrito.contains(e.target) && !boton.contains(e.target)){
  carrito.classList.add("hidden");
}

});




