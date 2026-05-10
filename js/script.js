let cart = [];

function filterProducts(category, button) {
  document.querySelectorAll(".category-card").forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.add("active");

  document.querySelectorAll(".product-category").forEach(section => {
    section.style.display =
      category === "all" || section.classList.contains(category)
        ? "block"
        : "none";
  });

  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

function getProductDetails(button) {
  const card = button.closest(".product-card");
  const name = card.querySelector("h3").innerText;
  const weight = card.querySelector("select").value;
  const price = parseInt(weight.match(/₹(\d+)/)[1]);

  return { card, name, weight, price };
}

function addToCart(button) {
  const { name, weight, price } = getProductDetails(button);
  const parent = button.closest(".cart-controls");

  const existingItem = cart.find(item => item.name === name && item.weight === weight);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, weight, price, qty: 1 });
  }

  parent.innerHTML = `
    <div class="qty-controls">
      <button onclick="changeProductQty(this, '${name}', '${weight}', -1)">-</button>
      <span>${getCartItemQty(name, weight)}</span>
      <button onclick="changeProductQty(this, '${name}', '${weight}', 1)">+</button>
    </div>
  `;

  showToast(`${name} added to cart`);
  updateCart();
}

function changeProductQty(button, name, weight, change) {
  const item = cart.find(item => item.name === name && item.weight === weight);
  const parent = button.closest(".cart-controls");

  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter(item => !(item.name === name && item.weight === weight));

    parent.innerHTML = `
      <button class="cart-btn" onclick="addToCart(this)">Add to Cart</button>
    `;
  } else {
    parent.querySelector("span").innerText = item.qty;
  }

  updateCart();
}

function getCartItemQty(name, weight) {
  const item = cart.find(item => item.name === name && item.weight === weight);
  return item ? item.qty : 1;
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    count += item.qty;

    cartItems.innerHTML += `
      <div class="cart-card">
        <h3>${item.name}</h3>
        <p>${item.weight}</p>

        <div class="cart-qty">
          <button onclick="decreaseCartQty(${index})">-</button>
          <span>${item.qty}</span>
          <button onclick="increaseCartQty(${index})">+</button>
        </div>

        <h4>₹${itemTotal}</h4>

        <button class="remove-btn" onclick="removeCartItem(${index})">
          Remove
        </button>
      </div>
    `;
  });

  cartTotal.innerText = `Total: ₹${total}`;

  if (count > 0) {
    cartCount.innerText = count;
    cartCount.style.display = "flex";
  } else {
    cartCount.innerText = "";
    cartCount.style.display = "none";
  }
}

function increaseCartQty(index) {
  cart[index].qty += 1;
  updateCart();
  syncProductButtons();
}

function decreaseCartQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }

  updateCart();
  syncProductButtons();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  updateCart();
  syncProductButtons();
}

function syncProductButtons() {
  document.querySelectorAll(".product-card").forEach(card => {
    const name = card.querySelector("h3").innerText;
    const weight = card.querySelector("select").value;
    const controls = card.querySelector(".cart-controls");
    const item = cart.find(item => item.name === name && item.weight === weight);

    if (item) {
      controls.innerHTML = `
        <div class="qty-controls">
          <button onclick="changeProductQty(this, '${name}', '${weight}', -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeProductQty(this, '${name}', '${weight}', 1)">+</button>
        </div>
      `;
    } else {
      controls.innerHTML = `
        <button class="cart-btn" onclick="addToCart(this)">Add to Cart</button>
      `;
    }
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function orderCartOnWhatsApp() {
  if (cart.length === 0) {
    showToast("Cart is empty");
    return;
  }

  let message = "Hello, I want to order:%0A%0A";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    message += `Item: ${item.name}%0A`;
    message += `Weight: ${item.weight}%0A`;
    message += `Quantity: ${item.qty}%0A`;
    message += `Price: ₹${itemTotal}%0A%0A`;
  });

  message += `Total: ₹${total}%0A%0A`;
  message += `Location: Keshavapatnam, Karimnagar`;

  window.open(`https://wa.me/918019603343?text=${message}`, "_blank");
}

function openMenu() {
  document.getElementById("mobileMenu").classList.add("active");
  document.querySelector(".sticky-icons").style.display = "none";
}

function closeMenu() {
  document.getElementById("mobileMenu").classList.remove("active");
  document.querySelector(".sticky-icons").style.display = "flex";
}

updateCart();

window.addEventListener("load", () => {

  setTimeout(() => {

    const loader = document.getElementById("loader");

    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);

  }, 1200);

});

const fadeElements = document.querySelectorAll(".fade-up");

window.addEventListener("scroll", () => {

  fadeElements.forEach(el => {

    const top = el.getBoundingClientRect().top;

    if(top < window.innerHeight - 100){
      el.classList.add("show");
    }

  });

});