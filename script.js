const menuButton = document.querySelector('#menuButton');
const mobileNav = document.querySelector('#mobileNav');
const bagCount = document.querySelector('#bagCount');
const toast = document.querySelector('#toast');
let count = 0;
const cart = JSON.parse(window.localStorage.getItem('likha-cart') || '[]');
const cartDialog = document.querySelector('#cartDialog');
const cartItems = document.querySelector('#cartItems');
const cartEmpty = document.querySelector('#cartEmpty');
const cartSubtotal = document.querySelector('#cartSubtotal');

const productPrices = { 'Dark Chocolate': 350, 'Sea Salt': 370, 'Roasted Hazelnut': 380, Calamansi: 360, Ube: 390, Mango: 380, 'Pili Coconut Milk': 390, Barako: 400, 'LIKHA Gift Box': 1750 };
const saveCart = () => window.localStorage.setItem('likha-cart', JSON.stringify(cart));

menuButton.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.mobile-nav a').forEach((link) => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const renderCart = () => {
  cartItems.innerHTML = cart.map((item) => `<div class="cart-item"><div><strong>${item.name}</strong>${item.variant ? `<small>${item.variant}</small>` : ''}<span>₱${productPrices[item.name].toLocaleString('en-PH')} each</span></div><div class="cart-quantity"><button type="button" data-cart-action="decrease" data-cart-name="${item.name}" aria-label="Remove one ${item.name}">−</button><strong>${item.quantity}</strong><button type="button" data-cart-action="increase" data-cart-name="${item.name}" aria-label="Add one ${item.name}">+</button></div></div>`).join('');
  cartEmpty.hidden = cart.length > 0;
  const subtotal = cart.reduce((total, item) => total + productPrices[item.name] * item.quantity, 0);
  cartSubtotal.textContent = `₱${subtotal.toLocaleString('en-PH')}`;
  count = cart.reduce((total, item) => total + item.quantity, 0);
  bagCount.textContent = count;
  saveCart();
};

const addToBag = (name, variant = '') => {
  const existing = cart.find((item) => item.name === name && item.variant === variant);
  if (existing) existing.quantity += 1;
  else cart.push({ name, variant, quantity: 1 });
  renderCart();
  toast.textContent = `${name} added to your bag`;
  toast.classList.add('show');
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
};

const giftFlavours = ['Dark Chocolate', 'Sea Salt', 'Roasted Hazelnut', 'Calamansi', 'Ube', 'Mango', 'Pili Coconut Milk', 'Barako'];
const giftDialog = document.querySelector('#giftDialog');
const giftDialogAdd = document.querySelector('#giftDialogAdd');
const flavourSelects = [...document.querySelectorAll('#flavourPicks select')];

flavourSelects.forEach((select, index) => {
  select.innerHTML = `<option value="" disabled ${index === 0 ? 'selected' : ''}>Select a flavour</option>${giftFlavours.map((flavour) => `<option value="${flavour}">${flavour}</option>`).join('')}`;
});

const openGiftSelection = () => {
  flavourSelects.forEach((select) => { select.value = ''; });
  giftDialog.showModal();
};

document.querySelectorAll('.add-button').forEach((button) => button.addEventListener('click', (event) => {
  event.stopPropagation();
  const name = button.closest('.product-card').dataset.name;
  if (name === 'LIKHA Gift Box') openGiftSelection();
  else addToBag(name);
}));

document.querySelector('#bagButton').addEventListener('click', () => { window.location.href = 'cart.html'; });

const reviewGrid = document.querySelector('.review-grid');
const previousReviews = document.querySelector('.review-prev');
const nextReviews = document.querySelector('.review-next');
const updateReviewArrows = () => {
  previousReviews.disabled = reviewGrid.scrollLeft <= 2;
  nextReviews.disabled = reviewGrid.scrollLeft + reviewGrid.clientWidth >= reviewGrid.scrollWidth - 2;
};
previousReviews.addEventListener('click', () => reviewGrid.scrollBy({ left: -reviewGrid.clientWidth * 0.82, behavior: 'smooth' }));
nextReviews.addEventListener('click', () => reviewGrid.scrollBy({ left: reviewGrid.clientWidth * 0.82, behavior: 'smooth' }));
reviewGrid.addEventListener('scroll', updateReviewArrows, { passive: true });
window.addEventListener('resize', updateReviewArrows);
updateReviewArrows();

const productGrid = document.querySelector('.products');
const previousProducts = document.querySelector('.product-prev');
const nextProducts = document.querySelector('.product-next');
const updateProductArrows = () => {
  previousProducts.disabled = productGrid.scrollLeft <= 2;
  nextProducts.disabled = productGrid.scrollLeft + productGrid.clientWidth >= productGrid.scrollWidth - 2;
};
previousProducts.addEventListener('click', () => productGrid.scrollTo({ left: Math.max(0, productGrid.scrollLeft - productGrid.clientWidth), behavior: 'smooth' }));
nextProducts.addEventListener('click', () => productGrid.scrollTo({ left: Math.min(productGrid.scrollWidth - productGrid.clientWidth, productGrid.scrollLeft + productGrid.clientWidth), behavior: 'smooth' }));
productGrid.addEventListener('scroll', updateProductArrows, { passive: true });
window.addEventListener('resize', updateProductArrows);
updateProductArrows();

const shopSection = document.querySelector('.shop');
const viewAllChocolate = document.querySelector('#viewAllChocolate');
viewAllChocolate.addEventListener('click', () => {
  const expanded = shopSection.classList.toggle('is-expanded');
  viewAllChocolate.setAttribute('aria-expanded', String(expanded));
  viewAllChocolate.firstChild.textContent = expanded ? 'Show less chocolate ' : 'View all chocolate ';
  if (!expanded) {
    productGrid.scrollTo({ left: 0, behavior: 'smooth' });
    updateProductArrows();
  }
});

const productDetails = {
  'Dark Chocolate': { price: '₱350', description: 'Our house bar: deep, balanced, and quietly intense.', ingredients: 'Cacao beans, coconut sugar, Philippine coconut milk', source: 'Davao cacao, Philippines', format: '60g · 70% cacao', story: 'We start with cacao from smallholder farms in Davao, then let its natural fruit and roast notes lead. Coconut milk gives the bar a smooth finish without taking away its depth.' },
  'Sea Salt': { price: '₱370', description: 'A mineral bright bar finished with a clean, savory snap.', ingredients: 'Cacao beans, coconut sugar, Philippine coconut milk, sea salt', source: 'Davao cacao + Philippine sea salt', format: '60g · 70% cacao', story: 'The salt is added at the end, so it lands in little bright flashes against the cacao. It is a bar built for that first slow bite and the second one you did not plan to take.' },
  'Roasted Hazelnut': { price: '₱380', description: 'Toasty, creamy, and layered with roasted hazelnut crunch.', ingredients: 'Cacao beans, coconut sugar, Philippine coconut milk, roasted hazelnut', source: 'Davao cacao + roasted hazelnuts', format: '60g · 55% cacao', story: 'We roast the hazelnuts until warm and fragrant, then fold them through silky chocolate. The result is generous and familiar, with a little more depth than expected.' },
  Calamansi: { price: '₱360', description: 'A bright citrus bar with a fragrant Philippine finish.', ingredients: 'Cacao beans, coconut sugar, Philippine coconut milk, calamansi', source: 'Davao cacao + local calamansi', format: '60g · 60% cacao', story: 'Calamansi brings a lively, floral acidity to the cacao. It is our ode to the fruit trees and backyard flavors that make home taste like home.' },
  Ube: { price: '₱390', description: 'Velvety cacao with toasted, floral purple yam notes.', ingredients: 'Cacao beans, coconut sugar, Philippine coconut milk, ube', source: 'Davao cacao + purple yam from Northern Luzon', format: '60g · 55% cacao', story: 'Ube gives this bar its gentle earthiness and signature violet character. We pair it with coconut milk for a soft, almost custard like finish.' },
  Mango: { price: '₱380', description: 'Sunlit mango folded into creamy, plant based chocolate.', ingredients: 'Cacao beans, coconut sugar, Philippine coconut milk, mango', source: 'Davao cacao + Philippine mangoes', format: '60g · 55% cacao', story: 'Sweet, aromatic mango meets the roasted warmth of cacao. This is the bar for bright afternoons, beach bags, and the last piece after dinner.' },
  'Pili Coconut Milk': { price: '₱390', description: 'Silky coconut milk chocolate with a deep pili nut finish.', ingredients: 'Cacao beans, coconut sugar, Philippine coconut milk, pili nuts', source: 'Davao cacao + Bicol pili nuts', format: '60g · 60% cacao', story: 'Pili nuts are prized for their buttery texture, and they make a natural partner for coconut milk. Together they give this bar a distinctly Filipino richness.' },
  Barako: { price: '₱400', description: 'Bold cacao layered with the dark, aromatic roast of Batangas barako coffee.', ingredients: 'Cacao beans, coconut sugar, Philippine coconut milk, barako coffee', source: 'Davao cacao + Batangas barako coffee', format: '60g · 60% cacao', story: 'Barako coffee brings a smoky, almost wine inspired roast to the chocolate. We source it from Batangas and keep the blend balanced, so the coffee opens slowly instead of overpowering the cacao.' },
  'LIKHA Gift Box': { price: '₱1,750', description: 'A gift ready collection of five signature LIKHA bars.', ingredients: 'See individual bar descriptions; contains coconut milk and tree nuts', source: 'A curated selection from Philippine cacao and local ingredients', format: '5 × 60g bars', story: 'A little tasting journey through the LIKHA collection, wrapped for sharing. It is made for birthdays, thank yous, dinner tables, and keeping one bar back for yourself.' }
};

const productImages = {
  'Dark Chocolate': './assets/likha-dark-packshot.png', 'Sea Salt': './assets/likha-sea-salt-packshot.png', 'Roasted Hazelnut': './assets/likha-hazelnut-packshot.png', Calamansi: './assets/likha-calamansi-packshot.png', Ube: './assets/likha-ube-packshot.png', Mango: './assets/likha-mango-packshot.png', 'Pili Coconut Milk': './assets/likha-pili-packshot.png', Barako: './assets/likha-barako-packshot.png', 'LIKHA Gift Box': './assets/likha-gift-box.png'
};

const productDialog = document.querySelector('#productDialog');
const dialogImage = document.querySelector('#dialogImage');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogAdd = document.querySelector('#dialogAdd');
let activeProduct = '';
const openProduct = (name) => {
  const detail = productDetails[name];
  activeProduct = name;
  dialogTitle.textContent = name;
  document.querySelector('#dialogDescription').textContent = detail.description;
  document.querySelector('#dialogIngredients').textContent = detail.ingredients;
  document.querySelector('#dialogSource').textContent = detail.source;
  document.querySelector('#dialogFormat').textContent = detail.format;
  document.querySelector('#dialogStory').textContent = detail.story;
  document.querySelector('#dialogPrice').textContent = detail.price;
  document.querySelector('#dialogNote').textContent = 'Made with coconut milk. Please review ingredients for allergens; selected bars contain tree nuts and our kitchen handles nuts.';
  dialogImage.style.backgroundImage = `url("${productImages[name]}")`;
  productDialog.showModal();
};
document.querySelectorAll('.product-card').forEach((card) => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openProduct(card.dataset.name));
  card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProduct(card.dataset.name); } });
});
document.querySelector('#dialogClose').addEventListener('click', () => productDialog.close());
dialogAdd.addEventListener('click', () => {
  if (activeProduct === 'LIKHA Gift Box') { productDialog.close(); openGiftSelection(); }
  else { addToBag(activeProduct); productDialog.close(); }
});
productDialog.addEventListener('click', (event) => { if (event.target === productDialog) productDialog.close(); });
document.querySelector('#giftDialogClose').addEventListener('click', () => giftDialog.close());
giftDialogAdd.addEventListener('click', () => {
  const flavours = flavourSelects.map((select) => select.value);
  if (flavours.some((flavour) => !flavour)) {
    toast.textContent = 'Please choose a flavour for each bar';
    toast.classList.add('show');
    window.clearTimeout(window.toastTimer);
    window.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
    return;
  }
  addToBag('LIKHA Gift Box', flavours.join(', '));
  giftDialog.close();
});
giftDialog.addEventListener('click', (event) => { if (event.target === giftDialog) giftDialog.close(); });

document.querySelector('#cartDialogClose').addEventListener('click', () => cartDialog.close());
cartDialog.addEventListener('click', (event) => { if (event.target === cartDialog) cartDialog.close(); });
cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('[data-cart-action]');
  if (!button) return;
  const item = cart.find((entry) => entry.name === button.dataset.cartName);
  if (!item) return;
  if (button.dataset.cartAction === 'increase') item.quantity += 1;
  if (button.dataset.cartAction === 'decrease') item.quantity -= 1;
  if (item.quantity <= 0) cart.splice(cart.indexOf(item), 1);
  renderCart();
});
document.querySelector('#cartCheckout').addEventListener('click', () => {
  toast.textContent = 'Checkout will be available soon';
  toast.classList.add('show');
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
});
renderCart();

document.querySelector('#year').textContent = new Date().getFullYear();

const journalStories = {
  dairy: { title: 'Why we make chocolate without dairy', body: 'Coconut milk gives our chocolate its gentle creaminess while keeping the cacao at the center. It is a thoughtful choice for a lighter footprint, and it lets the toasted character of Philippine cacao come through in every bite.' },
  davao: { title: 'A field note from Davao', body: 'In Davao, cacao grows beneath generous shade and bright tropical rain. We work with the rhythm of the harvest, paying attention to the fruit, the fermentation, and the people whose care carries each bean from the farm to our kitchen.' },
  cacao: { title: 'The long, delicious road to 70%', body: 'A balanced dark bar is built through patience. We roast in small batches, taste as the cacao opens, and refine the blend until the natural fruit, floral notes, and deep roast feel like one clear voice.' }
};
const journalGrid = document.querySelector('.journal-grid');
const journalPrev = document.querySelector('#journalPrev');
const journalNext = document.querySelector('#journalNext');
const journalCards = [...document.querySelectorAll('.journal-grid article')];
let journalIndex = 0;
const updateJournalArrows = () => {
  journalPrev.disabled = journalIndex === 0;
  journalNext.disabled = journalIndex === journalCards.length - 1;
};
const scrollToJournal = (index) => {
  journalIndex = Math.max(0, Math.min(index, journalCards.length - 1));
  const cardWidth = journalCards[0].getBoundingClientRect().width;
  const gap = parseFloat(window.getComputedStyle(journalGrid).gap) || 0;
  const offset = journalIndex * (cardWidth + gap);
  journalGrid.style.transform = `translateX(-${offset}px)`;
  updateJournalArrows();
};
journalPrev.addEventListener('click', () => scrollToJournal(journalIndex - 1));
journalNext.addEventListener('click', () => scrollToJournal(journalIndex + 1));
window.addEventListener('resize', () => scrollToJournal(journalIndex));
updateJournalArrows();
const journalDialog = document.querySelector('#journalDialog');
const journalDialogTitle = document.querySelector('#journalDialogTitle');
const journalDialogBody = document.querySelector('#journalDialogBody');
document.querySelectorAll('.journal-link').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  const story = journalStories[link.dataset.story];
  journalDialogTitle.textContent = story.title;
  journalDialogBody.textContent = story.body;
  journalDialog.showModal();
}));
document.querySelector('#journalDialogClose').addEventListener('click', () => journalDialog.close());
journalDialog.addEventListener('click', (event) => { if (event.target === journalDialog) journalDialog.close(); });
