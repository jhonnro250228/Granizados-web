document.getElementById("pedidoForm").addEventListener("submit", function(e) {
        e.preventDefault();

        const nombre=document.getElementById("nombre").value;
        const telefono=document.getElementById("telefono").value;
        const producto=document.getElementById("producto").value;
        const Topping=document.getElementById("Topping").value;
        const Chupeta=document.getElementById("Chupeta").value;
        const Mensaje=document.getElementById("Mensaje").value;

        const texto= `Hola soy ${nombre}
        Teléfono: ${telefono}
        Quiero pedir: ${producto}
        con Topping: ${topping}
        y Chupeta: ${chupeta}
        Mensaje: ${mensaje}`;

        const url="https://wa.me/573104224157?text=" + encodeURIComponent(texto);

        window.open(url, "_blank");

    });

    function filtrar(sabor){
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    if(sabor === 'all' || card.dataset.sabor === sabor){
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

let carrito = JSON.parse(localStorage.getItem("carrito")) || {};
let total = parseInt(localStorage.getItem("total")) || 0;
let contador = parseInt(localStorage.getItem("contador")) || 0;

actualizarUI();


// ===== AGREGAR =====
function agregarCarrito(nombre, precio, imagen){
  document.querySelector(".carrito").style.transform = "scale(1.2)";

setTimeout(()=>{
  document.querySelector(".carrito").style.transform = "scale(1)";
},200);
    if(carrito[nombre]){
    carrito[nombre].cantidad++;
  } else {
    carrito[nombre] = { precio, cantidad: 1, imagen };
  }

  total += precio;
  contador++;

  guardarStorage();
  actualizarUI();

  const btn = document.querySelector(".carrito");

btn.style.transform="scale(1.25)";
setTimeout(()=>btn.style.transform="scale(1)",150);
}


// ===== QUITAR =====
function quitarProducto(nombre){

  total -= carrito[nombre].precio;
  contador--;

  carrito[nombre].cantidad--;

  if(carrito[nombre].cantidad <= 0){
    delete carrito[nombre];
  }

  guardarStorage();
  actualizarUI();
}


// ===== VACIAR =====
function vaciarCarrito(){
  carrito = {};
  total = 0;
  contador = 0;

  guardarStorage();
  actualizarUI();
}


// ===== GUARDAR LOCALSTORAGE =====
function guardarStorage(){
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("total", total);
  localStorage.setItem("contador", contador);
}


// ===== UI =====
function actualizarUI(){

  document.getElementById("total").textContent = total;
  document.getElementById("contador").textContent = contador;

  const items = document.getElementById("items");
  items.innerHTML = "";

  for(let nombre in carrito){

    const item = document.createElement("div");
    item.className = "item-carrito";

    item.innerHTML = `
      <img src="${carrito[nombre].imagen}">
      <span>${carrito[nombre].cantidad}x ${nombre}</span>
      <button onclick="quitarProducto('${nombre}')">x</button>
    `;

    items.appendChild(item);
  }
}


// ===== TOGGLE =====
function toggleCarrito(){
  document.getElementById("carritoLista").classList.toggle("hidden");
}


// ===== WHATSAPP =====
function enviarPedido(){

  if(total === 0) return;

  let mensaje = "Hola, quiero este pedido:%0A%0A";

  for(let nombre in carrito){
    mensaje += `${carrito[nombre].cantidad}x ${nombre}%0A`;
  }

  mensaje += `%0ATotal: $${total}`;

  window.open(`https://wa.me/573104224157?text=${mensaje}`, "_blank");
}

const carritoBtn = document.querySelector(".carrito");

carritoBtn.style.transform = "scale(1.25)";
setTimeout(()=> carritoBtn.style.transform="scale(1)", 150);

function doPost(e){

  const sheet = SpreadsheetApp.getActiveSheet();

  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.nombre,
    data.telefono,
    data.pedido,
    data.total
  ]);

  return ContentService.createTextOutput("ok");
}

fetch("https://docs.google.com/spreadsheets/d/11KgJtfzP3tK263F3jevqSYknj1XLFcCCblppLQ4GD0Q/edit?gid=0#gid=0", {
  method:"POST",
  body: JSON.stringify({
    nombre,
    telefono,
    pedido: mensaje,
    total
  })
});

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js");
}
