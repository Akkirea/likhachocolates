const cartPageItems = document.querySelector('#cartPageItems');
const cartPageEmpty = document.querySelector('#cartPageEmpty');
const cartPageSubtotal = document.querySelector('#cartPageSubtotal');
const cartPageToast = document.querySelector('#cartPageToast');
const productPrices = { 'Dark Chocolate': 350, 'Sea Salt': 370, 'Roasted Hazelnut': 380, Calamansi: 360, Ube: 390, Mango: 380, 'Pili Coconut Milk': 390, Barako: 400, 'LIKHA Gift Box': 1750 };
const cart = JSON.parse(window.localStorage.getItem('likha-cart') || '[]');

const saveCart = () => window.localStorage.setItem('likha-cart', JSON.stringify(cart));
const renderCart = () => {
  cartPageItems.innerHTML = cart.map((item) => `<div class="cart-page-item"><div><strong>${item.name}</strong>${item.variant ? `<small>Flavours: ${item.variant}</small>` : ''}<span>₱${productPrices[item.name].toLocaleString('en-PH')} each</span></div><div class="cart-page-quantity"><button type="button" data-action="decrease" data-name="${item.name}" data-variant="${item.variant || ''}" aria-label="Remove one ${item.name}">−</button><strong>${item.quantity}</strong><button type="button" data-action="increase" data-name="${item.name}" data-variant="${item.variant || ''}" aria-label="Add one ${item.name}">+</button></div></div>`).join('');
  cartPageEmpty.hidden = cart.length > 0;
  const subtotal = cart.reduce((total, item) => total + productPrices[item.name] * item.quantity, 0);
  cartPageSubtotal.textContent = `₱${subtotal.toLocaleString('en-PH')}`;
  saveCart();
};

cartPageItems.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const item = cart.find((entry) => entry.name === button.dataset.name && (entry.variant || '') === button.dataset.variant);
  if (!item) return;
  if (button.dataset.action === 'increase') item.quantity += 1;
  if (button.dataset.action === 'decrease') item.quantity -= 1;
  if (item.quantity <= 0) cart.splice(cart.indexOf(item), 1);
  renderCart();
});
document.querySelector('#cartPageCheckout').addEventListener('click', () => {
  cartPageToast.textContent = 'Checkout will be available soon';
  cartPageToast.classList.add('show');
  window.clearTimeout(window.cartPageToastTimer);
  window.cartPageToastTimer = window.setTimeout(() => cartPageToast.classList.remove('show'), 2200);
});
renderCart();
