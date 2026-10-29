let cart = [];

const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartBadge = document.getElementById('cart-badge');

function toggleCart() {
  cartSidebar.classList.toggle('active');
  cartOverlay.classList.toggle('active');
}

cartToggleBtn.addEventListener('click', toggleCart);
cartCloseBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartUI();
  if (!cartSidebar.classList.contains('active')) {
    toggleCart();
  }
}

function changeQuantity(name, delta) {
  const item = cart.find(item => item.name === name);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.name !== name);
    }
  }
  updateCartUI();
}

function updateCartUI() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let totalCount = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 25px; font-size: 0.82rem;">Tu orden está vacía.</p>';
  } else {
    cart.forEach(item => {
      total += item.price * item.quantity;
      totalCount += item.quantity;

      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <div>
          <h5 style="font-size: 0.85rem; font-weight: 600;">${item.name}</h5>
          <span style="color: var(--accent-gold-light); font-size: 0.78rem;">$${(item.price * item.quantity).toLocaleString('es-CL')}</span>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQuantity('${item.name}', -1)">-</button>
          <span style="font-size: 0.8rem;">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
    });
  }

  cartTotalElement.innerText = `$${total.toLocaleString('es-CL')}`;
  cartBadge.innerText = totalCount;
}

function sendOrderToWhatsApp() {
  if (cart.length === 0) return alert('Por favor agrega productos a tu pedido.');

  const phone = '56951605265'; // Número actualizado
  const orderType = document.getElementById('order-type').value;

  let message = `🥢 *NUEVA ORDEN - TAKUMI NIKKEI*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📍 *Modalidad:* ${orderType}\n\n`;
  message += `*Detalle:* \n`;

  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    message += `• *${item.quantity}x* ${item.name} ($${subtotal.toLocaleString('es-CL')})\n`;
  });

  message += `\n*TOTAL:* $${total.toLocaleString('es-CL')}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `📌 *Datos del cliente:*\n`;
  message += `- Nombre:\n`;
  message += `- Dirección:\n`;

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

function filterCategory(category, element) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  document.querySelectorAll('.product-card').forEach(product => {
    if (category === 'todos' || product.dataset.category === category) {
      product.style.display = 'flex';
    } else {
      product.style.display = 'none';
    }
  });
}

function handleScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(element => {
    if (element.getBoundingClientRect().top < window.innerHeight - 50) {
      element.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', handleScrollReveal);
handleScrollReveal();

// Canvas Partículas
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.15;
    this.speedY = (Math.random() - 0.5) * 0.15;
    this.opacity = Math.random() * 0.3 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.fillStyle = `rgba(197, 160, 89, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  const numberOfParticles = Math.floor((canvas.width * canvas.height) / 18000);
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();