     
document.addEventListener("DOMContentLoaded", () => {

    // ==================================
    // MENÚ PARA MÓVILES
    // ==================================

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");

    if (menuBtn && nav) {
        menuBtn.addEventListener("click", () => {
            nav.classList.toggle("active");
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
            });
        });
    }

    // ==================================
    // BUSCADOR Y FILTROS
    // ==================================

    const search = document.getElementById("search");
    const brand = document.getElementById("brand");
    const type = document.getElementById("type");
    const products = document.querySelectorAll(".product");
    const noResults = document.getElementById("noResults");
    const resultCount = document.getElementById("resultCount");
    const clearFilters = document.getElementById("clearFilters");

    function filterProducts() {

        const searchText = search.value.toLowerCase().trim();
        const selectedBrand = brand.value;
        const selectedType = type.value;

        let visibleProducts = 0;

        products.forEach(product => {

            const name = product.dataset.name.toLowerCase();
            const model = product.dataset.model.toLowerCase();
            const productBrand = product.dataset.brand;
            const productType = product.dataset.type;

            const matchesSearch =
                name.includes(searchText) ||
                model.includes(searchText) ||
                productBrand.toLowerCase().includes(searchText) ||
                productType.toLowerCase().includes(searchText);

            const matchesBrand =
                selectedBrand === "all" ||
                productBrand === selectedBrand;

            const matchesType =
                selectedType === "all" ||
                productType === selectedType;

            const isVisible =
                matchesSearch && matchesBrand && matchesType;

            product.hidden = !isVisible;

            if (isVisible) {
                visibleProducts++;
            }

        });

        noResults.hidden = visibleProducts !== 0;

        resultCount.textContent =
            `${visibleProducts} producto${visibleProducts !== 1 ? "s" : ""} encontrado${visibleProducts !== 1 ? "s" : ""}`;
    }

    search.addEventListener("input", filterProducts);
    brand.addEventListener("change", filterProducts);
    type.addEventListener("change", filterProducts);

    clearFilters.addEventListener("click", () => {
        search.value = "";
        brand.value = "all";
        type.value = "all";
        filterProducts();
    });

    // ==================================
    // VENTANA DE DETALLES
    // ==================================

    const modal = document.getElementById("productModal");
    const closeModal = document.getElementById("closeModal");

    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalTechnology = document.getElementById("modalTechnology");
    const modalPrice = document.getElementById("modalPrice");
    const modalWhatsApp = document.getElementById("modalWhatsApp");

    let selectedProduct = null;

    function openProductModal(product) {

        selectedProduct = product;

        modalTitle.textContent = product.dataset.name;
        modalDescription.textContent = product.dataset.description;
        modalTechnology.textContent =
            `Marca: ${product.dataset.brand} · Tecnología: ${product.dataset.type}`;

        modalPrice.textContent =
            `Bs ${product.dataset.price}`;

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        closeModal.focus();
    }

    function closeProductModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        selectedProduct = null;
    }

    document.querySelectorAll(".details-btn").forEach(button => {

        button.addEventListener("click", () => {

            const product = button.closest(".product");

            openProductModal(product);

        });

    });

    closeModal.addEventListener("click", closeProductModal);

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeProductModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal.classList.contains("active")) {
            closeProductModal();
        }
    });

    // ==================================
    // CONSULTAS POR WHATSAPP
    // ==================================

    // CAMBIA ESTE NÚMERO POR TU WHATSAPP REAL
    // Formato internacional: país + número, sin + ni espacios.

    const whatsappNumber = "59170036675";

    function sendWhatsApp(product) {

        const message =
            `Hola, SCREENLAB. Quiero consultar por: ${product.dataset.name}. ` +
            `Precio publicado: Bs ${product.dataset.price}. ` +
            `¿Tienen disponibilidad y cuál es la compatibilidad exacta?`;

        const url =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank", "noopener,noreferrer");
    }

    document.querySelectorAll(".whatsapp-btn").forEach(button => {

        button.addEventListener("click", () => {

            const product = button.closest(".product");

            sendWhatsApp(product);

        });

    });

    modalWhatsApp.addEventListener("click", () => {

        if (selectedProduct) {
            sendWhatsApp(selectedProduct);
        }

    });

    // ==================================
    // INICIALIZACIÓN
    // ==================================

    filterProducts();

});
