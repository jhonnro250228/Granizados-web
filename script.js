// ============================
// ESTADO INICIAL
// ============================
let carrito  = JSON.parse(localStorage.getItem("carrito")) || {};
let total    = parseInt(localStorage.getItem("total")) || 0;
let contador = parseInt(localStorage.getItem("contador")) || 0;

actualizarUI();


// ============================
// FORMULARIO (Sheets + WhatsApp)
// ============================
document.getElementById("pedidoForm").addEventListener("submit", function(e){

  e.preventDefault();

  const nombre   = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const producto = document.getElementById("producto").value;
  const topping  = document.getElementById("Topping").value;
  const chupeta  = document.getElementById("Chupeta").value;
  const mensaje  = document.getElementById("Mensaje").value;

  const datos = { nombre, telefono, producto, topping, chupeta, mensaje, total };

  guardarEnSheets(datos);

  const texto = `
Hola soy ${nombre}
Teléfono: ${telefono}
Producto: ${producto}
Topping: ${topping}
Chupeta: ${chupeta}
Mensaje: ${mensaje}
Total: $${total}
`;

  window.open("https://wa.me/573104224157?text=" + encodeURIComponent(texto), "_blank");
  alert("Pedido enviado ✅");
});


// ============================
// FILTRAR
// ============================
function filtrar(sabor){
  document.querySelectorAll(".card").forEach(card=>{
    card.style.display = (sabor==="all" || card.dataset.sabor===sabor) ? "block":"none";
  });
}


// ============================
// CARRITO
// ============================
function agregarCarrito(nombre, precio, imagen){
  
  if(carrito[nombre]) carrito[nombre].cantidad++;
  else carrito[nombre] = {precio, cantidad:1, imagen};

  total += precio;
  contador++;

  guardarStorage();
  actualizarUI();

  document.getElementById("carritoLista").classList.remove("hidden");
  animarCarrito();

// 🔊 SONIDO
  const audio = document.getElementById("soundAdd");
  audio.currentTime = 0;
  audio.play().catch(()=>{});
}

function quitarProducto(nombre){

  if(!carrito[nombre]) return;

  total -= carrito[nombre].precio;
  contador--;

  carrito[nombre].cantidad--;

  if(carrito[nombre].cantidad<=0) delete carrito[nombre];

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


// ============================
// STORAGE
// ============================
function guardarStorage(){
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("total", total);
  localStorage.setItem("contador", contador);
}


// ============================
// UI
// ============================
function actualizarUI(){

  document.getElementById("total").textContent = total;
  document.getElementById("contador").textContent = contador;

  const items = document.getElementById("items");
  items.innerHTML="";

  for(let nombre in carrito){

    const div=document.createElement("div");
    div.className="item-carrito";

    div.innerHTML=`
      <img src="${carrito[nombre].imagen}">
      <span>${carrito[nombre].cantidad}x ${nombre}</span>
      <button onclick="quitarProducto('${nombre}')">x</button>
    `;

    items.appendChild(div);
  }
}


// ============================
// TOGGLE CARRITO
// ============================
document.getElementById("btnCarrito")
.addEventListener("click", ()=> {
  document.getElementById("carritoLista").classList.toggle("hidden");
});


// ============================
// ANIMACIÓN
// ============================
function animarCarrito(){
  const btn=document.querySelector(".carrito");
  btn.style.transform="scale(1.2)";
  setTimeout(()=>btn.style.transform="scale(1)",150);
}


// ============================
// WHATSAPP DESDE CARRITO
// ============================
function enviarPedido(){

  if(contador===0) return alert("Agrega productos primero 🙂");

  let msg="Hola, quiero pedir:%0A%0A";

  for(let n in carrito){
    msg+=`${carrito[n].cantidad}x ${n}%0A`;
  }

  msg+=`%0ATotal: $${total}`;

  window.open(`https://wa.me/573104224157?text=${msg}`,"_blank");
}


// ============================
// GOOGLE SHEETS
// ============================
function guardarEnSheets(datos){

  fetch("https://script.google.com/macros/s/AKfycbyarUC47CH20wCIYY9kl7S4oG5XYrs0hH6pHeOshgCdfvJDxjx7HQS-kBqq62LiQvUr/exec",{
    method:"POST",
    body:JSON.stringify(datos)
  });
}

//===================
// BOTON INSTALAR APP
//===================
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const btn = document.getElementById("btnInstalar");
  btn.hidden = false;

  btn.addEventListener("click", () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      btn.hidden = true;
    });
  });
});

// ===== SPLASH AUTO OCULTAR =====
window.addEventListener("load", ()=>{
  setTimeout(()=>{
    document.getElementById("splash").style.display="none";
  },1200);
});


