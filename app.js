/* =====================================================
   ⚙️ CONFIG
===================================================== */

const logoPath = "img/0000.jpeg";


/* =====================================================
   ✨ GLOBAL ANIMATION ENGINE
===================================================== */

/* smooth scrolling */
document.documentElement.style.scrollBehavior = "smooth";


/* page fade-in */
document.body.style.opacity = 0;
window.addEventListener("load", ()=>{
  document.body.style.transition = "opacity .6s ease";
  document.body.style.opacity = 1;
});


/* =====================================================
   🛍 PRODUCTS
===================================================== */

const products = [
  { id:1, name:"GearSouls T-Shirt", price:25, image:logoPath, description:"Premium printed tee" },
  { id:2, name:"Sticker Pack", price:10, image:logoPath, description:"Vinyl logo stickers" },
  { id:3, name:"Hoodie", price:45, image:logoPath, description:"Heavy street hoodie" }
];


/* =====================================================
   🛒 CART STATE
===================================================== */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getTotalQty(){
  return cart.reduce((t,i)=>t+i.qty,0);
}

function getTotalPrice(){
  return cart.reduce((t,i)=>{
    const p = products.find(x=>x.id===i.id);
    return t + (p.price * i.qty);
  },0);
}


/* =====================================================
   🔢 NAV COUNT
===================================================== */

function updateCartCount(){
  const el = document.getElementById("cart-count");
  if(el) el.innerText = getTotalQty();
}

updateCartCount();


/* =====================================================
   🔥 3D TILT CARDS (MAGIC)
===================================================== */

function enable3DTilt(){

  document.querySelectorAll(".card").forEach(card=>{

    card.addEventListener("mousemove", e=>{
      const rect = card.getBoundingClientRect();

      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform =
        `rotateY(${x*12}deg) rotateX(${-y*12}deg) scale(1.03)`;
    });

    card.addEventListener("mouseleave", ()=>{
      card.style.transform = "none";
    });

  });

}


/* =====================================================
   ✨ MAGNETIC BUTTONS
===================================================== */

function magneticButtons(){

  document.querySelectorAll("button").forEach(btn=>{

    btn.addEventListener("mousemove", e=>{
      const rect = btn.getBoundingClientRect();

      const x = (e.clientX - rect.left - rect.width/2)/6;
      const y = (e.clientY - rect.top - rect.height/2)/6;

      btn.style.transform = `translate(${x}px, ${y}px)`;
    });

    btn.addEventListener("mouseleave", ()=>{
      btn.style.transform = "none";
    });

  });

}


/* =====================================================
   🚀 ADD TO CART + FLY ANIMATION
===================================================== */

function flyToCart(img){

  const cartIcon = document.querySelector(".nav-link[href='cart.html']") || document.querySelector(".nav");

  if(!img || !cartIcon) return;

  const clone = img.cloneNode(true);

  const rect = img.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  clone.style.position = "fixed";
  clone.style.left = rect.left + "px";
  clone.style.top = rect.top + "px";
  clone.style.width = "80px";
  clone.style.zIndex = 9999;
  clone.style.transition = "all .7s cubic-bezier(.2,.8,.2,1)";

  document.body.appendChild(clone);

  setTimeout(()=>{
    clone.style.left = cartRect.left + "px";
    clone.style.top = cartRect.top + "px";
    clone.style.width = "20px";
    clone.style.opacity = 0;
  },10);

  setTimeout(()=> clone.remove(), 700);
}


/* =====================================================
   ➕ ADD TO CART
===================================================== */

function addToCart(id, btn){

  const found = cart.find(i=>i.id===id);

  if(found){
    found.qty++;
  } else {
    cart.push({id, qty:1});
  }

  saveCart();
  updateCartCount();

  /* flying image */
  const img = btn.closest(".card")?.querySelector("img");
  flyToCart(img);

  /* success animation */
  btn.innerText = "✓";
  btn.style.background = "#2ecc71";

  setTimeout(()=>{
    btn.innerText = "Add";
    btn.style.background = "";
  },600);

  renderCart();
}


/* =====================================================
   🛍 SHOP PAGE RENDER
===================================================== */

const grid = document.getElementById("products");

if(grid){

  products.forEach(p=>{
    grid.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="viewProduct(${p.id})">View</button>
        <button onclick="addToCart(${p.id}, this)">Add</button>
      </div>
    `;
  });

  enable3DTilt();
  magneticButtons();
}


/* =====================================================
   📦 PRODUCT PAGE
===================================================== */

function viewProduct(id){
  document.body.style.opacity = 0;
  setTimeout(()=> window.location.href = `product.html?id=${id}`, 200);
}


/* =====================================================
   🛒 CART RENDER
===================================================== */

const cartItems = document.getElementById("cart-items");

function renderCart(){

  if(!cartItems) return;

  cartItems.innerHTML = "";

  if(cart.length === 0){
    cartItems.innerHTML = `<div style="opacity:.5">Your cart is empty</div>`;
    document.getElementById("total").innerText = "$0";
    return;
  }

  cart.forEach((item,index)=>{

    const product = products.find(p=>p.id===item.id);
    const sub = product.price * item.qty;

    cartItems.innerHTML += `
      <div class="cart-card">
        <div>${product.name}</div>

        <div>
          <button onclick="changeQty(${index},-1)">−</button>
          ${item.qty}
          <button onclick="changeQty(${index},1)">+</button>
        </div>

        <div>$${sub}</div>
      </div>
    `;
  });

  document.getElementById("total").innerText = "$" + getTotalPrice();
}

renderCart();


/* =====================================================
   CHANGE QTY
===================================================== */

function changeQty(i, delta){

  cart[i].qty += delta;

  if(cart[i].qty <= 0){
    cart.splice(i,1);
  }

  saveCart();
  updateCartCount();
  renderCart();
}


/* =====================================================
   CHECKOUT
===================================================== */

function checkout(){
  alert("Stripe integration next 🚀");
}


/* =====================================================
   🚀 FUTURISTIC FX ENGINE
===================================================== */


/* ===============================
   ✨ SCROLL REVEAL ANIMATION
=============================== */

const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
    }
  });
},{
  threshold:.15
});

document.querySelectorAll(".card, .hero, .cart-card, h2")
  .forEach(el=>{
    el.classList.add("reveal");
    observer.observe(el);
  });



/* ===============================
   🌌 PARALLAX HERO
=============================== */

window.addEventListener("scroll", ()=>{
  const y = window.scrollY * 0.25;
  const hero = document.querySelector(".hero");
  if(hero) hero.style.transform = `translateY(${y}px)`;
});



/* ===============================
   🔦 CURSOR SPOTLIGHT
=============================== */

const light = document.createElement("div");

light.style.cssText = `
position:fixed;
width:300px;
height:300px;
border-radius:50%;
pointer-events:none;
background:radial-gradient(circle, rgba(255,255,255,.08), transparent 60%);
mix-blend-mode:overlay;
z-index:9999;
`;

document.body.appendChild(light);

document.addEventListener("mousemove", e=>{
  light.style.left = e.clientX - 150 + "px";
  light.style.top = e.clientY - 150 + "px";
});



/* ===============================
   🌠 PARTICLE BACKGROUND
=============================== */

const canvas = document.createElement("canvas");
canvas.id = "particles";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let particles = [];

for(let i=0;i<60;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*2+1,
    vx:(Math.random()-.5)*0.4,
    vy:(Math.random()-.5)*0.4
  });
}

function animateParticles(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  particles.forEach(p=>{
    p.x += p.vx;
    p.y += p.vy;

    if(p.x<0||p.x>canvas.width) p.vx*=-1;
    if(p.y<0||p.y>canvas.height) p.vy*=-1;

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle="rgba(255,255,255,.15)";
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();



/* ===============================
   🔥 NAVBAR HIDE/SHOW ON SCROLL
=============================== */

let lastScroll = 0;
const nav = document.querySelector(".navbar");

window.addEventListener("scroll", ()=>{
  const current = window.scrollY;

  if(current > lastScroll && current > 80){
    nav.style.transform = "translateY(-120%)";
  } else {
    nav.style.transform = "none";
  }

  lastScroll = current;
});
