/* =================================
   CONFIG
================================= */
const logoPath = "img/0000.jpeg";


/* =================================
   PRODUCTS
================================= */
const products = [
  { id:1, name:"GearSouls T-Shirt", price:25, image:logoPath, description:"Premium printed tee" },
  { id:2, name:"Sticker Pack", price:10, image:logoPath, description:"Vinyl logo stickers" },
  { id:3, name:"Hoodie", price:45, image:logoPath, description:"Heavy street hoodie" }
];


/* =================================
   CART STATE
================================= */
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


/* =================================
   UPDATE NAV COUNT
================================= */
function updateCartCount(){
  const el = document.getElementById("cart-count");
  if(el) el.innerText = getTotalQty();
}

updateCartCount();


/* =================================
   ADD TO CART (smooth)
================================= */
function addToCart(id, btn){

  const found = cart.find(i=>i.id===id);

  if(found){
    found.qty++;
  } else {
    cart.push({id, qty:1});
  }

  saveCart();
  updateCartCount();

  /* nice feedback */
  if(btn){
    btn.innerText = "✓";
    btn.style.background = "#2ecc71";

    setTimeout(()=>{
      btn.innerText = "Add";
      btn.style.background = "";
    },500);
  }

  renderCart(); // live update if on cart page
}


/* =================================
   SHOP PAGE
================================= */
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
}


/* =================================
   PRODUCT PAGE
================================= */
function viewProduct(id){
  window.location.href = `product.html?id=${id}`;
}

const detail = document.getElementById("product-detail");

if(detail){
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const product = products.find(p=>p.id===id);

  detail.innerHTML = `
    <div class="product-page">
      <img src="${product.image}">
      <div>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <h2>$${product.price}</h2>
        <button onclick="addToCart(${product.id}, this)">Add</button>
      </div>
    </div>
  `;
}


/* =================================
   CART RENDER (MODERN)
================================= */
const cartItems = document.getElementById("cart-items");

function renderCart(){

  if(!cartItems) return;

  cartItems.innerHTML = "";

  if(cart.length === 0){
    cartItems.innerHTML = `
      <div style="opacity:.5; text-align:center; padding:40px">
        Your cart is empty
      </div>
    `;
    document.getElementById("total").innerText = "$0";
    return;
  }

  cart.forEach((item,index)=>{

    const product = products.find(p=>p.id===item.id);
    const sub = product.price * item.qty;

    cartItems.innerHTML += `
      <div class="cart-card">

        <div class="cart-info">
          <img src="${product.image}">
          <div>
            <div class="cart-name">${product.name}</div>
            <div class="cart-price-small">$${product.price} each</div>
          </div>
        </div>

        <div class="qty-controls">
          <button onclick="changeQty(${index},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index},1)">+</button>
        </div>

        <div class="item-total">$${sub}</div>

      </div>
    `;
  });

  document.getElementById("total").innerText = "$" + getTotalPrice();
}

renderCart();


/* =================================
   CHANGE QTY (NO RELOAD)
================================= */
function changeQty(i, delta){

  cart[i].qty += delta;

  if(cart[i].qty <= 0){
    cart.splice(i,1);
  }

  saveCart();
  updateCartCount();
  renderCart();
}


/* =================================
   CHECKOUT
================================= */
function checkout(){
  alert("Stripe/PayPal integration next 🚀");
}
