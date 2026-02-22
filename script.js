// =============================
// FORMULARIO SHEETS
// =============================
document.getElementById("pedidoForm").addEventListener("submit", function(e){

  e.preventDefault();

  const nombre   = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const producto = document.getElementById("producto").value;
  const topping  = document.getElementById("Topping").value;
  const chupeta  = document.getElementById("Chupeta").value;
  const mensaje  = document.getElementById("Mensaje").value;

  const datos = {
    nombre,
    telefono,
    producto,
    topping,
    chupeta,
    mensaje,
    total
  };

  // 👉 guardar en Google Sheets
  guardarEnSheets(datos);

  alert("Pedido enviado ✅");

});


// =============================
// FILTROS
// =============================
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


// =============================
// CARRITO + LOCALSTORAGE
// =============================
let carrito = JSON.parse(localStorage.getItem("carrito")) || {};
let total = parseInt(localStorage.getItem("total")) || 0;
let contador = parseInt(localStorage.getItem("contador")) || 0;

actualizarUI();


// ===== AGREGAR =====
function agregarCarrito(nombre, precio, imagen){

  if(carrito[nombre]){
    carrito[nombre].cantidad++;
  } else {
    carrito[nombre] = { precio, cantidad: 1, imagen };
  }

  total += precio;
  contador++;

  animarCarrito();
  guardarStorage();
  actualizarUI();
}


// ===== QUITAR =====
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


// ===== VACIAR =====
function vaciarCarrito(){
  carrito = {};
  total = 0;
  contador = 0;

  guardarStorage();
  actualizarUI();
}


// ===== GUARDAR STORAGE =====
function guardarStorage(){
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("total", total);
  localStorage.setItem("contador", contador);
}


// ===== ACTUALIZAR UI =====
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


// ===== TOGGLE CARRITO =====
document.getElementById("btnCarrito")
  .addEventListener("click", toggleCarrito);
function toggleCarrito(){
  document.getElementById("carritoLista").classList.toggle("hidden");
}


// ===== ANIMACIÓN =====
function animarCarrito(){
  const btn = document.querySelector(".carrito");

  btn.style.transform="scale(1.25)";
  setTimeout(()=>btn.style.transform="scale(1)",150);
}

// ===== ENVIAR PEDIDO POR WHATSAPP =====
function enviarPedido(){

  if(contador === 0){
    alert("Agrega productos primero 🙂");
    return;
  }

  let mensaje = "Hola, quiero pedir:%0A%0A";

  for(let nombre in carrito){
    mensaje += `${carrito[nombre].cantidad}x ${nombre}%0A`;
  }

  mensaje += `%0ATotal: $${total}`;

  const telefono = "573104224157"; // tu número

  const url = `https://wa.me/${telefono}?text=${mensaje}`;

  window.open(url, "_blank");
}

// =============================
// GOOGLE SHEETS
// =============================
function guardarEnSheets(datos){

  fetch("https://script.google.com/macros/s/AKfycbyarUC47CH20wCIYY9kl7S4oG5XYrs0hH6pHeOshgCdfvJDxjx7HQS-kBqq62LiQvUr/exec", {
    method: "POST",
    body: JSON.stringify(datos)
  })
  .then(()=> console.log("Guardado en Sheets ✅"))
  .catch(()=> console.log("Error Sheets ❌"));
}


// =============================
// SERVICE WORKER (opcional PWA)
// =============================
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("SW activo"))
    .catch(err => console.log("Error SW", err));
}


