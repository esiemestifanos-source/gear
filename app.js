/* =====================================================
   ⚙️ CONFIG
===================================================== */

const logoPath = "img/0000.jpeg";
const CART_KEY = "gearsouls_cart_v3";


/* =====================================================
   ✨ GLOBAL ENGINE
===================================================== */

document.documentElement.style.scrollBehavior = "smooth";

/* page fade */
document.body.style.opacity = 0;
window.addEventListener("load", () => {
  document.body.style.transition = "opacity .6s ease";
  document.body.style.opacity = 1;
});

/* small toast system (NEW) */
function toast(msg){
  const t = document.createElement("div");
  t.innerText = msg;
  t.style.cssText = `
    position:fixed;
    bottom:25px;
    left:50%;
    transform:translateX(-50%);
    background:#111;
    color:#fff;
    padding:10px 18px;
    border-radius:8px;
    font-size:14px;
    z-index:99999;
    opacity:0;
    transition:.3s;
  `;
  document.body.appendChild(t);

  setTimeout(()=>t.style.opacity=1,10);
  setTimeout(()=>t.remove(),1800);
}


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

let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

function saveCart(){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
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
   🔥 3D TILT CARDS (original kept)
===================================================== */

function enable3DTilt(){

  if(window.innerWidth < 768) return;

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
   ✨ MAGNETIC BUTTONS (original kept)
===================================================== */

function magneticButtons(){

  if(window.innerWidth < 768) return;

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
   🚀 FLY TO CART (original kept)
===================================================== */

function flyToCart(img){

  const cartIcon =
    document.querySelector(".nav-link[href='cart.html']");

  if(!img || !cartIcon) return;

  const clone = img.cloneNode(true);

  const rect = img.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  clone.style.cssText = `
    position:fixed;
    left:${rect.left}px;
    top:${rect.top}px;
    width:80px;
    z-index:9999;
    transition:all .7s cubic-bezier(.2,.8,.2,1);
  `;

  document.body.appendChild(clone);

  setTimeout(()=>{
    clone.style.left = cartRect.left + "px";
    clone.style.top = cartRect.top + "px";
    clone.style.width = "20px";
    clone.style.opacity = 0;
  },10);

  setTimeout(()=>clone.remove(),700);
}


/* =====================================================
   ➕ ADD TO CART
===================================================== */

function addToCart(id, btn){

  const found = cart.find(i=>i.id===id);

  if(found) found.qty++;
  else cart.push({id, qty:1});

  saveCart();
  updateCartCount();

  const img = btn.closest(".card")?.querySelector("img");
  flyToCart(img);

  toast("Added to cart ✓");

  renderCart();
}


/* =====================================================
   🛍 SHOP RENDER
===================================================== */

const grid = document.getElementById("products");

if(grid){

  products.forEach(p=>{
    grid.innerHTML += `
      <div class="card reveal">
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
      <div class="cart-card reveal">
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
   ✨ SCROLL REVEAL (original kept)
===================================================== */

const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
    }
  });
},{threshold:.15});

document.querySelectorAll(".card, .hero, .cart-card, h2")
  .forEach(el=>{
    el.classList.add("reveal");
    observer.observe(el);
  });


/* =====================================================
   🌌 PARALLAX HERO (original kept)
===================================================== */

window.addEventListener("scroll", ()=>{
  const y = window.scrollY * 0.25;
  const hero = document.querySelector(".hero");
  if(hero) hero.style.transform = `translateY(${y}px)`;
});


/* =====================================================
   🔦 CURSOR SPOTLIGHT (original kept)
===================================================== */

if(window.innerWidth > 768){
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
}


/* =====================================================
   🌠 PARTICLES (optimized)
===================================================== */

if(window.innerWidth > 768){

  const canvas = document.createElement("canvas");
  canvas.style.position="fixed";
  canvas.style.zIndex="-1";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }

  resize();
  window.addEventListener("resize",resize);

  let particles = Array.from({length:40},()=>({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*2,
    vx:(Math.random()-.5)*0.4,
    vy:(Math.random()-.5)*0.4
  }));

  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;

      if(p.x<0||p.x>canvas.width) p.vx*=-1;
      if(p.y<0||p.y>canvas.height) p.vy*=-1;

      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle="rgba(255,255,255,.15)";
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}


/* =====================================================
   🔥 NAVBAR HIDE (original kept)
===================================================== */

const nav = document.querySelector(".navbar");
let lastScroll = 0;

if(nav){
  window.addEventListener("scroll", ()=>{
    const current = window.scrollY;

    if(current > lastScroll && current > 80){
      nav.style.transform = "translateY(-120%)";
    } else {
      nav.style.transform = "none";
    }

    lastScroll = current;
  });
}
/* =====================================================
   🚀 EXTRA FUTURE ANIMATIONS PACK (ADD-ON ONLY)
   Paste BELOW everything
===================================================== */


/* ===============================
   ✨ FLOATING CARDS IDLE EFFECT
=============================== */

setInterval(()=>{
  document.querySelectorAll(".card").forEach((card,i)=>{
    card.style.transition = "transform 3s ease-in-out";
    card.style.transform = `translateY(${Math.sin(Date.now()/800 + i)*6}px)`;
  });
},60);



/* ===============================
   🌈 BUTTON RIPPLE CLICK EFFECT
=============================== */

document.querySelectorAll("button").forEach(btn=>{

  btn.style.position = "relative";
  btn.style.overflow = "hidden";

  btn.addEventListener("click", e=>{

    const circle = document.createElement("span");

    const d = Math.max(btn.clientWidth, btn.clientHeight);

    circle.style.cssText = `
      position:absolute;
      width:${d}px;
      height:${d}px;
      border-radius:50%;
      background:rgba(255,255,255,.35);
      left:${e.offsetX - d/2}px;
      top:${e.offsetY - d/2}px;
      transform:scale(0);
      animation:ripple .6s linear;
      pointer-events:none;
    `;

    btn.appendChild(circle);

    setTimeout(()=>circle.remove(),600);
  });

});


/* ripple animation style */
const rippleStyle = document.createElement("style");
rippleStyle.innerHTML = `
@keyframes ripple{
  to{
    transform:scale(3);
    opacity:0;
  }
}
`;
document.head.appendChild(rippleStyle);



/* ===============================
   🔥 PAGE TRANSITION SLIDE
=============================== */

document.querySelectorAll("a").forEach(link=>{

  if(link.target === "_blank") return;

  link.addEventListener("click", e=>{
    const href = link.getAttribute("href");

    if(!href || href.startsWith("#")) return;

    e.preventDefault();

    document.body.style.transition = "opacity .25s";
    document.body.style.opacity = 0;

    setTimeout(()=>{
      window.location.href = href;
    },250);
  });

});



/* ===============================
   🌌 HERO TEXT TYPEWRITER EFFECT
=============================== */

const heroTitle = document.querySelector(".hero h1");

if(heroTitle){

  const text = heroTitle.innerText;
  heroTitle.innerText = "";

  let i=0;

  function type(){
    if(i < text.length){
      heroTitle.innerText += text[i++];
      setTimeout(type,40);
    }
  }

  type();
}



/* ===============================
   💫 AUTO FADE-IN ELEMENTS
=============================== */

document.querySelectorAll("section, .auth-card, .account-card")
  .forEach(el=>{
    el.style.opacity = 0;
    el.style.transform = "translateY(30px)";
  });

const fadeObserver = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.transition = "all .6s ease";
      e.target.style.opacity = 1;
      e.target.style.transform = "none";
    }
  });
});

document.querySelectorAll("section, .auth-card, .account-card")
  .forEach(el=> fadeObserver.observe(el));



/* ===============================
   🛒 CART SHAKE WHEN UPDATED
=============================== */

function cartShake(){
  const cartIcon = document.querySelector(".nav-link[href='cart.html']");
  if(!cartIcon) return;

  cartIcon.style.transition="transform .3s";
  cartIcon.style.transform="rotate(-10deg)";

  setTimeout(()=>{
    cartIcon.style.transform="rotate(10deg)";
  },80);

  setTimeout(()=>{
    cartIcon.style.transform="none";
  },160);
}

/* hook into addToCart */
const oldAdd = window.addToCart;
window.addToCart = function(...args){
  oldAdd(...args);
  cartShake();
};



/* ===============================
   🌠 SMOOTH SCROLL PROGRESS BAR
=============================== */

const bar = document.createElement("div");

bar.style.cssText = `
position:fixed;
top:0;
left:0;
height:3px;
width:0%;
background:#00ffd0;
z-index:99999;
transition:width .1s;
`;

document.body.appendChild(bar);

window.addEventListener("scroll",()=>{
  const percent =
    window.scrollY /
    (document.body.scrollHeight - window.innerHeight) * 100;

  bar.style.width = percent + "%";
});
/* =====================================================
   🌌 SPATIAL DEPTH + MOUSE FX PACK (SHOP PAGE)
   Paste at VERY BOTTOM of app.js
===================================================== */


/* ===============================
   🪐 1. 3D DEPTH PARALLAX GRID
=============================== */

const shopGrid = document.getElementById("products");

if(shopGrid){

  document.addEventListener("mousemove", e=>{

    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    shopGrid.style.transform =
      `perspective(1200px) rotateY(${x/6}deg) rotateX(${-y/6}deg)`;

  });

}



/* ===============================
   ✨ 2. CARD GLOW FOLLOW MOUSE
=============================== */

document.querySelectorAll(".card").forEach(card=>{

  card.addEventListener("mousemove", e=>{

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.background =
      `radial-gradient(circle at ${x}px ${y}px,
        rgba(255,255,255,.12),
        rgba(255,255,255,.03) 40%,
        #0f0f14 70%)`;

  });

  card.addEventListener("mouseleave", ()=>{
    card.style.background = "";
  });

});



/* ===============================
   🌠 3. DEPTH SCALE ON HOVER
=============================== */

document.querySelectorAll(".card").forEach(card=>{

  card.addEventListener("mouseenter", ()=>{
    card.style.zIndex = 5;
    card.style.transform += " scale(1.08)";
  });

  card.addEventListener("mouseleave", ()=>{
    card.style.zIndex = 1;
  });

});



/* ===============================
   🌌 4. BACKGROUND STARFIELD
=============================== */

const starsCanvas = document.createElement("canvas");
starsCanvas.id = "stars";
starsCanvas.style.cssText = `
position:fixed;
inset:0;
z-index:-2;
pointer-events:none;
`;

document.body.appendChild(starsCanvas);

const sctx = starsCanvas.getContext("2d");

function resizeStars(){
  starsCanvas.width = innerWidth;
  starsCanvas.height = innerHeight;
}

resizeStars();
window.addEventListener("resize", resizeStars);

let stars = [];

for(let i=0;i<120;i++){
  stars.push({
    x:Math.random()*starsCanvas.width,
    y:Math.random()*starsCanvas.height,
    r:Math.random()*1.5,
    speed:Math.random()*0.3 + 0.1
  });
}

function animateStars(){

  sctx.clearRect(0,0,starsCanvas.width,starsCanvas.height);

  stars.forEach(star=>{
    star.y += star.speed;

    if(star.y > starsCanvas.height){
      star.y = 0;
      star.x = Math.random()*starsCanvas.width;
    }

    sctx.beginPath();
    sctx.arc(star.x, star.y, star.r, 0, Math.PI*2);
    sctx.fillStyle = "rgba(255,255,255,.25)";
    sctx.fill();
  });

  requestAnimationFrame(animateStars);
}

animateStars();

/* =====================================================
   🌑 DARK ENERGY CURSOR (NO DOT – premium feel)
===================================================== */


/* ===============================
   CANVAS FIELD
=============================== */

const field = document.createElement("canvas");
field.style.position = "fixed";
field.style.top = 0;
field.style.left = 0;
field.style.pointerEvents = "none";
field.style.zIndex = 9999;

document.body.appendChild(field);

const fctx = field.getContext("2d");

function resizeField(){
  field.width = window.innerWidth;
  field.height = window.innerHeight;
}
resizeField();
window.addEventListener("resize", resizeField);



/* ===============================
   PARTICLE ENERGY
=============================== */

let mx = 0, my = 0;

document.addEventListener("mousemove", e=>{
  mx = e.clientX;
  my = e.clientY;
});

const sparks = [];

for(let i=0;i<80;i++){
  sparks.push({
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    vx:(Math.random()-.5)*0.6,
    vy:(Math.random()-.5)*0.6,
    size:Math.random()*2+1
  });
}



/* ===============================
   ANIMATION LOOP
=============================== */

function animateField(){

  fctx.clearRect(0,0,field.width,field.height);

  sparks.forEach(p=>{

    /* movement */
    p.x += p.vx;
    p.y += p.vy;

    /* bounce */
    if(p.x<0||p.x>field.width) p.vx*=-1;
    if(p.y<0||p.y>field.height) p.vy*=-1;

    /* attraction to mouse */
    const dx = mx - p.x;
    const dy = my - p.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if(dist < 140){
      p.x -= dx * 0.01;
      p.y -= dy * 0.01;
    }

    /* draw soft dark spark */
    fctx.beginPath();
    fctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    fctx.fillStyle = "rgba(255,255,255,0.08)";
    fctx.fill();
  });


  /* dark ripple around cursor */
  const grad = fctx.createRadialGradient(mx, my, 0, mx, my, 160);
  grad.addColorStop(0,"rgba(255,255,255,.06)");
  grad.addColorStop(1,"rgba(0,0,0,0)");

  fctx.fillStyle = grad;
  fctx.beginPath();
  fctx.arc(mx, my, 160, 0, Math.PI*2);
  fctx.fill();


  requestAnimationFrame(animateField);
}

animateField();



/* ===============================
   MAGNETIC HOVER (strong feel)
=============================== */

document.querySelectorAll("button, .card").forEach(el=>{

  el.addEventListener("mousemove", e=>{
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width/2)/5;
    const y = (e.clientY - rect.top - rect.height/2)/5;

    el.style.transform = `translate(${x}px,${y}px) scale(1.03)`;
  });

  el.addEventListener("mouseleave", ()=>{
    el.style.transform = "none";
  });

});



/* ===============================
   🧊 6. EXTRA SPACE BETWEEN CARDS
=============================== */

if(shopGrid){
  shopGrid.style.gap = "40px";
  shopGrid.style.padding = "80px 60px";
  shopGrid.style.transformStyle = "preserve-3d";
}



/* ===============================
   🚀 7. FLOAT SLOWLY (space feel)
=============================== */

setInterval(()=>{
  document.querySelectorAll(".card").forEach((card,i)=>{
    card.style.transition="transform 5s ease-in-out";
    card.style.transform +=
      ` translateY(${Math.sin(Date.now()/1200+i)*4}px)`;
  });
},120);
