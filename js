
// ==================================
// MENÚ RESPONSIVE
// ==================================

const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Cerrar menú al seleccionar una opción

nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});


// ==================================
// BUSCADOR Y FILTROS
// ==================================

const search = document.getElementById('search');
const brand = document.getElementById('brand');
const type = document.getElementById('type');

const products = document.querySelectorAll('.product');
const noResults = document.getElementById('noResults');

function filterProducts() {

    const searchValue = search.value.toLowerCase().trim();
    const brandValue = brand.value;
    const typeValue = type.value;

    let visibleProducts = 0;

    products.forEach(product => {

        const name = product.innerText.toLowerCase();

        const productBrand = product.dataset.brand;
        const productType = product.dataset.type;

        const matchesSearch = name.includes(searchValue);

        const matchesBrand =
            brandValue === 'all' || productBrand === brandValue;

        const matchesType =
            typeValue === 'all' || productType === typeValue;

        const isVisible =
            matchesSearch && matchesBrand && matchesType;

        product.style.display = isVisible ? '' : 'none';

        if (isVisible) {
            visibleProducts++;
        }

    });

    noResults.hidden = visibleProducts !== 0;
}

search.addEventListener('input', filterProducts);
brand.addEventListener('change', filterProducts);
type.addEventListener('change', filterProducts);


// ==================================
// CONSULTAR PRODUCTOS POR WHATSAPP
// ==================================

// IMPORTANTE:
// Sustituye el número por tu número real.
// Incluye código de país, sin + ni espacios.

const whatsappNumber = '59170000000';

const buyButtons = document.querySelectorAll('.buy');

buyButtons.forEach(button => {

    button.addEventListener('click', (event) => {

        event.preventDefault();

        const productName = button.dataset.product;

        const message = encodeURIComponent(
            `Hola, quiero consultar disponibilidad y precio de: ${productName}`
        );

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${message}`;

        window.open(whatsappURL, '_blank');

    });

});
