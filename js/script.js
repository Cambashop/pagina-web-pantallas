    
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

        const searchText = search ? search.value.toLowerCase().trim() : "";
        const selectedBrand = brand ? brand.value : "all";
        const selectedType = type ? type.value : "all";

        let visibleProducts = 0;

        products.forEach(product => {

            const name = (product.dataset.name || "").toLowerCase();
            const model = (product.dataset.model || "").toLowerCase();
            const productBrand = product.dataset.brand || "";
            const productType = product.dataset.type || "";

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

        if (noResults) {
            noResults.hidden = visibleProducts !== 0;
        }

        if (resultCount) {
            resultCount.textContent =
                `${visibleProducts} producto${visibleProducts !== 1 ? "s" : ""} encontrado${visibleProducts !== 1 ? "s" : ""}`;
        }
    }

    if (search) search.addEventListener("input", filterProducts);
    if (brand) brand.addEventListener("change", filterProducts);
    if (type) type.addEventListener("change", filterProducts);

    if (clearFilters) {
        clearFilters.addEventListener("click", () => {
            if (search) search.value = "";
            if (brand) brand.value = "all";
            if (type) type.value = "all";

            filterProducts();
        });
    }

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

        if (!product || !modal) return;

        selectedProduct = product;

        if (modalTitle) {
            modalTitle.textContent = product.dataset.name || "Producto SCREENLAB";
        }

        if (modalDescription) {
            modalDescription.textContent = product.dataset.description || "";
        }

        if (modalTechnology) {
            modalTechnology.textContent =
                `Marca: ${product.dataset.brand || ""} · Tecnología: ${product.dataset.type || ""}`;
        }

        if (modalPrice) {
            modalPrice.textContent = `Bs ${product.dataset.price || "Consultar"}`;
        }

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        if (closeModal) closeModal.focus();
    }

    function closeProductModal() {

        if (!modal) return;

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

    if (closeModal) {
        closeModal.addEventListener("click", closeProductModal);
    }

    if (modal) {

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                closeProductModal();
            }

        });

    }

    document.addEventListener("keydown", event => {

        if (event.key === "Escape" && modal && modal.classList.contains("active")) {
            closeProductModal();
        }

    });

    // ==================================
    // CONSULTAS POR WHATSAPP
    // ==================================

    const whatsappNumber = "59170036675";

    function sendWhatsApp(product) {

        if (!product) return;

        const name = product.dataset.name || "Producto SCREENLAB";
        const price = product.dataset.price || "Consultar";
        const model = product.dataset.model || "";

        const message =
            `Hola, SCREENLAB. Quiero consultar por: ${name}. ` +
            `Modelo: ${model}. ` +
            `Precio publicado: Bs ${price}. ` +
            `¿Tienen disponibilidad?`;

        const url =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.location.href = url;
    }

    // Botones de WhatsApp de los productos
    document.addEventListener("click", event => {

        const whatsappButton = event.target.closest(".whatsapp-btn");

        if (whatsappButton) {

            const product = whatsappButton.closest(".product");

            sendWhatsApp(product);

        }

    });

    // Botón de WhatsApp de la ventana de detalles
    if (modalWhatsApp) {

        modalWhatsApp.addEventListener("click", () => {

            if (selectedProduct) {
                sendWhatsApp(selectedProduct);
            }

        });

    }

    // ==================================
    // INICIALIZACIÓN
    // ==================================

    filterProducts();

});
