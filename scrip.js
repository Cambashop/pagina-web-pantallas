// ====== DATOS ======
const COLORS = {
  negro: "#1d1d1f", carey: "#8b5a2b", cristal: "#cfd8dc",
  azul: "#1b3a5c", rosa: "#e8a5a5", dorado: "#c9a74b"
};

const LENSES = [
  { id: "basico", name: "Solo montura / sin graduación", price: 0 },
  { id: "graduado", name: "Graduado monofocal", price: 0 },
  { id: "luzazul", name: "Filtro de luz azul", price: 50 },
  { id: "progresivo", name: "Progresivos", price: 200 }
];

const PRODUCTS = [
  { id: 1, name: "Durand", shape: "redonda", cat: "optico", price: 95, colors: ["carey", "negro", "cristal"], tag: "Más vendido" },
  { id: 2, name: "Haskell", shape: "rectangular", cat: "optico", price: 95, colors: ["negro", "azul"] },
  { id: 3, name: "Felix", shape: "cuadrada", cat: "optico", price: 145, colors: ["cristal", "carey"], tag: "Nuevo" },
  { id: 4, name: "Louise", shape: "gato", cat: "optico", price: 95, colors: ["rosa", "carey", "negro"] },
  { id: 5, name: "Percey", shape: "redonda", cat: "optico", price: 145, colors: ["dorado", "negro"] },
  { id: 6, name: "Chamberlain", shape: "cuadrada", cat: "optico", price: 95, colors: ["azul", "cristal"] },
  { id: 7, name: "Raider", shape: "aviador", cat: "sol", price: 145, colors: ["dorado", "negro"], tag: "Nuevo" },
  { id: 8, name: "Winona", shape: "gato", cat: "sol", price: 95, colors: ["negro", "rosa"] },
  { id: 9, name: "Barkley", shape: "rectangular", cat: "sol", price: 95, colors: ["carey", "negro"] },
  { id: 10, name: "Topper", shape: "aviador", cat: "sol", price: 195, colors: ["dorado"], tag: "Edición limitada" },
  { id: 11, name: "Hughes", shape: "redonda", cat: "sol", price: 145, colors: ["azul", "carey"] },
  { id: 12, name: "Ames", shape: "cuadrada", cat: "sol", price: 95, colors: ["negro", "cristal"] }
];

// ====== ESTADO ======
const state = {
  cat: "all", shapes: new Set(), color: null, maxPrice: 195,
  sort: "featured", search: "",
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
  tryHome: JSON.parse(localStorage.getItem("tryHome") || "[]")
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const money = (n) => `$${n.toFixed(2)}`;
const save = () => {
  localStorage.setItem("cart", JSON.stringify(state.cart));
  localStorage.setItem("tryHome", JSON.stringify(state.tryHome));
};

// ====== SVG DE MONTURAS ======
function glassesSVG(shape, colorKey, sun = false) {
  const c = COLORS[colorKey];
  const lens = sun ? "rgba(30,30,30,.75)" : "rgba(200,230,255,.35)";
  const sw = colorKey === "dorado" ? 4 : 9;
  const shapes = {
    redonda: (x) => `<circle cx="${x}" cy="60" r="40"/>`,
    rectangular: (x) => `<rect x="${x - 48}" y="32" width="96" height="58" rx="10"/>`,
    cuadrada: (x) => `<rect x="${x - 44}" y="22" width="88" height="76" rx="16"/>`,
    gato: (x) => `<path d="M${x - 50} 35 Q${x} 15 ${x + 50} 28 Q${x + 48} 95 ${x} 95 Q${x - 50} 95 ${x - 50} 35Z"/>`,
    aviador: (x) => `<path d="M${x - 48} 30 L${x + 48} 30 Q${x + 50} 100 ${x} 100 Q${x - 50} 100 ${x - 48} 30Z"/>`
  };
  const draw = shapes[shape];
  return `
  <svg viewBox="0 0 300 120" xmlns="[w3.org](http://www.w3.org/2000/svg)">
    <g fill="${lens}" stroke="${c}" stroke-width="${sw}" stroke-linejoin="round">
      ${draw(90)}${draw(210)}
    </g>
    <path d="M135 55 Q150 42 165 55" fill="none" stroke="${c}" stroke-width="${sw - 2}"/>
    <path d="M38 48 L8 42 M262 48 L292 42" stroke="${c}" stroke-width="${sw - 2}" stroke-linecap="round"/>
  </svg>`;
}

// ====== FILTROS ======
function renderFilters() {
  const shapes = [...new Set(PRODUCTS.map((p) => p.shape))];
  $("#shapeFilters").innerHTML = shapes.map((s) => `
    <label><input type="checkbox" value="${s}" ${state.shapes.has(s) ? "checked" : ""}>
    ${s[0].toUpperCase() + s.slice(1)}</label>`).join("");

  $("#colorFilters").innerHTML = Object.entries(COLORS).map(([k, v]) => `
    <button class="swatch ${state.color === k ? "active" : ""}" data-color="${k}"
      style="background:${v}" title="${k}"></button>`).join("");
}

function filteredProducts() {
  let list = PRODUCTS.filter((p) =>
    (state.cat === "all" || p.cat === state.cat) &&
    (!state.shapes.size || state.shapes.has(p.shape)) &&
    (!state.color || p.colors.includes(state.color)) &&
    p.price <= state.maxPrice &&
    p.name.toLowerCase().includes(state.search.toLowerCase())
  );
  const sorters = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name)
  };
  if (sorters[state.sort]) list = [...list].sort(sorters[state.sort]);
  return list;
}

// ====== GRID ======
function renderGrid() {
  const list = filteredProducts();
  $("#resultsCount").textContent = `${list.length} monturas`;
  $("#catalogTitle").textContent =
    { all: "Todas las monturas", optico: "Lentes ópticos", sol: "Lentes de sol" }[state.cat];

  $("#productGrid").innerHTML = list.length ? list.map((p) => {
    const inTry = state.tryHome.includes(p.id);
    return `
    <article class="card" data-id="${p.id}">
      ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}
      ${p.cat === "optico" ? `<button class="card__try ${inTry ? "active" : ""}" data-try="${p.id}" title="Prueba en casa">👓</button>` : ""}
      <div class="card__img">${glassesSVG(p.shape, p.colors[0], p.cat === "sol")}</div>
      <h3>${p.name}</h3>
      <div class="card__meta"><span>${p.shape}</span><strong>${money(p.price)}</strong></div>
      <div class="card__colors">${p.colors.map((c) =>
        `<span class="swatch" style="background:${COLORS[c]}"></span>`).join("")}</div>
    </article>`;
  }).join("") : `<p class="empty">No encontramos monturas con esos filtros.</p>`;
}

// ====== MODAL PRODUCTO ======
function openProduct(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  let color = p.colors[0];
  const sun = p.cat === "sol";

  const render = () => {
    const lensSel = document.querySelector("input[name=lens]:checked")?.value || "basico";
    $("#modalBody").innerHTML = `
    <div class="pd">
      <div class="pd__img">${glassesSVG(p.shape, color, sun)}</div>
      <div>
        <h2>${p.name}</h2>
        <p>Montura ${p.shape} · ${color}</p>
        <p class="pd__price" id="pdPrice"></p>
        <h4>Color</h4>
        <div class="pd__colors">${p.colors.map((c) => `
          <button class="swatch ${c === color ? "active" : ""}" data-pc="${c}"
            style="background:${COLORS[c]}" title="${c}"></button>`).join("")}</div>
        <h4>Tipo de lente</h4>
        ${LENSES.map((l) => `
          <label class="lens-option">
            <span><input type="radio" name="lens" value="${l.id}" ${l.id === lensSel ? "checked" : ""}> ${l.name}</span>
            <span>${l.price ? "+" + money(l.price) : "Incluido"}</span>
          </label>`).join("")}
        <div class="pd__actions">
          <button class="btn btn--primary" id="addCart">Agregar al carrito</button>
          ${!sun ? `<button class="btn btn--outline" data-try="${p.id}">
            ${state.tryHome.includes(p.id) ? "Quitar de prueba en casa" : "Probar en casa gratis"}</button>` : ""}
        </div>
      </div>
    </div>`;
    updatePrice();

    $$("[data-pc]").forEach((b) => b.onclick = () => { color = b.dataset.pc; render(); });
    $$("input[name=lens]").forEach((r) => r.onchange = updatePrice);
    $("#addCart").onclick = () => {
      const lens = LENSES.find((l) => l.id === document.querySelector("input[name=lens]:checked").value);
      addToCart(p, color, lens);
      closeModal();
    };
  };

  const updatePrice = () => {
    const lens = LENSES.find((l) => l.id === document.querySelector("input[name=lens]:checked").value);
    $("#pdPrice").textContent = money(p.price + lens.price);
  };

  render();
  $("#productModal").classList.add("open");
}

const closeModal = () => $("#productModal").classList.remove("open");

// ====== CARRITO ======
function addToCart(p, color, lens) {
  const key = `${p.id}-${color}-${lens.id}`;
  const existing = state.cart.find((i) => i.key === key);
  if (existing) existing.qty++;
  else state.cart.push({ key, id: p.id, color, lens: lens.name, price: p.price + lens.price, qty: 1 });
  save(); updateBadges();
  toast(`${p.name} agregado al carrito`);
}

function toggleTry(id) {
  const i = state.tryHome.indexOf(id);
  if (i > -1) state.tryHome.splice(i, 1);
  else if (state.tryHome.length >= 5) return toast("Máximo 5 monturas para probar en casa");
  else state.tryHome.push(id);
  save(); updateBadges(); renderGrid(); renderSlots();
  toast(i > -1 ? "Quitado de prueba en casa" : "Añadido a prueba en casa");
}

function updateBadges() {
  $("#cartCount").textContent = state.cart.reduce((s, i) => s + i.qty, 0);
  $("#tryCount").textContent = state.tryHome.length;
}

let drawerMode = "cart";
function openDrawer(mode) {
  drawerMode = mode;
  renderDrawer();
  $("#drawer").classList.add("open");
  $("#overlay").classList.add("open");
}
function closeDrawer() {
  $("#drawer").classList.remove("open");
  $("#overlay").classList.remove("open");
}

function renderDrawer() {
  if (drawerMode === "cart") {
    $("#drawerTitle").textContent = "Tu carrito";
    if (!state.cart.length) {
      $("#drawerItems").innerHTML = `<p class="empty">Tu carrito está vacío</p>`;
      $("#drawerFoot").innerHTML = "";
      return;
    }
    $("#drawerItems").innerHTML = state.cart.map((i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      return `
      <div class="item">
        ${glassesSVG(p.shape, i.color, p.cat === "sol")}
        <div>
          <strong>${p.name}</strong>
          <small>${i.color} · ${i.lens}</small>
          <div class="qty">
            <button data-dec="${i.key}">−</button>${i.qty}<button data-inc="${i.key}">+</button>
          </div>
        </div>
        <div><strong>${money(i.price * i.qty)}</strong><br>
          <button class="remove" data-rm="${i.key}">🗑</button></div>
      </div>`;
    }).join("");
    const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
    $("#drawerFoot").innerHTML = `
      <div class="total-row"><span>Envío</span><span>Gratis</span></div>
      <div class="total-row"><span>Total</span><span>${money(total)}</span></div>
      <button class="btn btn--primary btn--full" id="checkout">Finalizar compra</button>`;
    $("#checkout").onclick = () => {
      state.cart = []; save(); updateBadges(); closeDrawer();
      toast("¡Gracias por tu compra! 🎉");
    };
  } else {
    $("#drawerTitle").textContent = `Prueba en casa (${state.tryHome.length}/5)`;
    $("#drawerItems").innerHTML = state.tryHome.length ? state.tryHome.map((id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return `<div class="item">${glassesSVG(p.shape, p.colors[0])}
        <div><strong>${p.name}</strong><small>${p.shape}</small></div>
        <button class="remove" data-try="${id}">🗑</button></div>`;
    }).join("") : `<p class="empty">Elige hasta 5 monturas con el ícono 👓</p>`;
    $("#drawerFoot").innerHTML = `
      <button class="btn btn--primary btn--full" id="orderTry" ${state.tryHome.length < 5 ? "disabled style='opacity:.5'" : ""}>
        ${state.tryHome.length < 5 ? `Elige ${5 - state.tryHome.length} más` : "Pedir gratis"}</button>`;
    $("#orderTry").onclick = () => {
      if (state.tryHome.length < 5) return;
      state.tryHome = []; save(); updateBadges(); renderGrid(); renderSlots(); closeDrawer();
      toast("¡Tu kit de prueba va en camino! 📦");
    };
  }
}

function renderSlots() {
  $("#trySlots").innerHTML = Array.from({ length: 5 }, (_, i) => {
    const id = state.tryHome[i];
    if (!id) return `<div class="slot">+</div>`;
    const p = PRODUCTS.find((x) => x.id === id);
    return `<div class="slot filled">${glassesSVG(p.shape, p.colors[0])}</div>`;
  }).join("");
}

// ====== QUIZ ======
const QUIZ = [
  { q: "¿Para qué los usarás?", key: "cat", opts: [["Ver mejor", "optico"], ["Protegerme del sol", "sol"]] },
  { q: "¿Qué forma de rostro tienes?", key: "face", opts: [["Redondo", "cuadrada"], ["Cuadrado", "redonda"], ["Ovalado", "gato"], ["Corazón", "aviador"]] },
  { q: "¿Qué estilo prefieres?", key: "style", opts: [["Clásico", "negro"], ["Cálido", "carey"], ["Atrevido", "rosa"], ["Minimal", "cristal"]] }
];
let quizStep = 0, quizAns = {};

function renderQuiz() {
  if (quizStep < QUIZ.length) {
    const s = QUIZ[quizStep];
    $("#quizBox").innerHTML = `
      <small>Pregunta ${quizStep + 1} de ${QUIZ.length}</small>
      <h3>${s.q}</h3>
      <div class="quiz__options">${s.opts.map(([l, v]) =>
        `<button data-ans="${v}">${l}</button>`).join("")}</div>`;
    $$("[data-ans]").forEach((b) => b.onclick = () => {
      quizAns[s.key] = b.dataset.ans; quizStep++; renderQuiz();
    });
  } else {
    const score = (p) =>
      (p.cat === quizAns.cat ? 3 : 0) + (p.shape === quizAns.face ? 2 : 0) + (p.colors.includes(quizAns.style) ? 1 : 0);
    const recs = [...PRODUCTS].sort((a, b) => score(b) - score(a)).slice(0, 3);
    $("#quizBox").innerHTML = `
      <h3>Te recomendamos:</h3>
      <div class="quiz__results">${recs.map((p) => `
        <div class="card" data-id="${p.id}">
          ${glassesSVG(p.shape, p.colors[0], p.cat === "sol")}
          <h3>${p.name}</h3><strong>${money(p.price)}</strong>
        </div>`).join("")}</div>
      <button class="btn btn--link" id="restartQuiz">Volver a empezar</button>`;
    $("#restartQuiz").onclick = () => { quizStep = 0; quizAns = {}; renderQuiz(); };
  }
}

// ====== TOAST ======
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2500);
}

// ====== EVENTOS ======
function setCategory(cat) {
  state.cat = cat;
  $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.cat === cat));
  renderGrid();
}

document.addEventListener("click", (e) => {
  const t = e.target;
  const tryBtn = t.closest("[data-try]");
  if (tryBtn) {
    e.stopPropagation();
    toggleTry(+tryBtn.dataset.try);
    if ($("#drawer").classList.contains("open")) renderDrawer();
    if ($("#productModal").classList.contains("open")) openProduct(+tryBtn.dataset.try);
    return;
  }
  const card = t.closest(".card");
  if (card) return openProduct(+card.dataset.id);

  if (t.matches("[data-close]") || t.id === "productModal") closeModal();
  if (t.dataset.color) {
    state.color = state.color === t.dataset.color ? null : t.dataset.color;
    renderFilters(); renderGrid();
  }
  const find = (k) => state.cart.find((i) => i.key === k);
  if (t.dataset.inc) { find(t.dataset.inc).qty++; save(); updateBadges(); renderDrawer(); }
  if (t.dataset.dec) {
    const it = find(t.dataset.dec);
    if (--it.qty <= 0) state.cart = state.cart.filter((i) => i !== it);
    save(); updateBadges(); renderDrawer();
  }
  if (t.dataset.rm) {
    state.cart = state.cart.filter((i) => i.key !== t.dataset.rm);
    save(); updateBadges(); renderDrawer();
  }
});

$("#shapeFilters").addEventListener("change", (e) => {
  e.target.checked ? state.shapes.add(e.target.value) : state.shapes.delete(e.target.value);
  renderGrid();
});
$("#priceRange").addEventListener("input", (e) => {
  state.maxPrice = +e.target.value;
  $("#priceValue").textContent = e.target.value;
  renderGrid();
});
$("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });
$("#search").addEventListener("input", (e) => { state.search = e.target.value; renderGrid(); });
$("#clearFilters").addEventListener("click", () => {
  Object.assign(state, { shapes: new Set(), color: null, maxPrice: 195, sort: "featured", search: "" });
  $("#priceRange").value = 195; $("#priceValue").textContent = 195;
  $("#sortSelect").value = "featured"; $("#search").value = "";
  renderFilters(); setCategory("all");
});

$$(".tab").forEach((t) => t.addEventListener("click", () => setCategory(t.dataset.cat)));
$$(".nav a[data-cat]").forEach((a) => a.addEventListener("click", () => {
  setCategory(a.dataset.cat); $("#nav").classList.remove("open");
}));
$("#menuToggle").addEventListener("click", () => $("#nav").classList.toggle("open"));
$("#cartBtn").addEventListener("click", () => openDrawer("cart"));
$("#homeTryBtn").addEventListener("click", () => openDrawer("try"));
$("#openTryHome").addEventListener("click", () => openDrawer("try"));
$("#closeDrawer").addEventListener("click", closeDrawer);
$("#overlay").addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeDrawer(); } });
$("#newsletter").addEventListener("submit", (e) => {
  e.preventDefault(); e.target.reset(); toast("¡Gracias por suscribirte! ✉️");
});

// ====== INIT ======
$("#heroVisual").innerHTML = glassesSVG("redonda", "carey");
renderFilters();
renderGrid();
renderSlots();
renderQuiz();
updateBadges();
