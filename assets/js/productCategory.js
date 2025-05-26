import { parsePrice } from "./util.js";
import { getAllProducts } from "./productBll.js";

// ====== PRODUCT LOGIC ======

const getPreferredVariant = (variants = []) => {
  if (!Array.isArray(variants)) return null;
  const defaultActive = variants.find((v) => v.isDefault && v.isActive);
  if (defaultActive) return defaultActive;
  const anyActive = variants.find((v) => v.isActive);
  if (anyActive) return anyActive;
  return null;
};

// ====== UI RENDER ======
function createShowcase(product) {
  const div = document.createElement("div");
  div.className = "showcase";

  const price = parsePrice(product.variants[0].price);
  const priceAfterDiscount = product.variants[0].priceAfterDiscount
    ? parsePrice(product.variants[0].priceAfterDiscount)
    : price;

  div.dataset.id = product.productId;
  div.dataset.name = product.name;
  div.dataset.price = priceAfterDiscount;
  div.dataset.image = product.imageUrls[0];

  div.innerHTML = `
    <div class="showcase-banner">
      <img src="${product.imageUrls[0]}" alt="${
    product.name
  }" class="product-img default" width="300">
      <img src="${product.imageUrls[1]}" alt="${
    product.name
  }" class="product-img hover" width="300">
      <p class="showcase-badge angle pink">Sale</p>
      <div class="showcase-actions">
        <button class="btn-action"><ion-icon name="heart-outline"></ion-icon></button>
        <button class="btn-action"><ion-icon name="eye-outline"></ion-icon></button>
        <button class="btn-action"><ion-icon name="repeat-outline"></ion-icon></button>
        <button class="btn-action bag-add"><ion-icon name="bag-add-outline"></ion-icon></button>
      </div>
    </div>
    <div class="showcase-content">
      <a href="/productCategory.html" class="showcase-category">${
        product.subcategory.name
      }</a>
      <div class="showcase-info">
        <h3><a class="showcase-title">${product.name}</a></h3>
        <div class="showcase-rating">
          <ion-icon name="star"></ion-icon>
          <ion-icon name="star"></ion-icon>
          <ion-icon name="star"></ion-icon>
          <ion-icon name="star-outline"></ion-icon>
          <ion-icon name="star-outline"></ion-icon>
        </div>
        <div class="price-box">
          <p class="price">${priceAfterDiscount.toLocaleString("vi-VN")} ₫</p>
          ${
            priceAfterDiscount !== price
              ? `<del>${price.toLocaleString("vi-VN")} ₫</del>`
              : "<del>1.900.000 ₫</del>"
          }
        </div>
      </div>
    </div>
  `;
  return div;
}

// ====== MAIN RENDER FUNCTION ======
function renderFilteredProducts({
  categoryName,
  sortBy = "priceAsc",
  limit = 10,
}) {
  const container = document.querySelector(".container-product-category");
  const grid = container.querySelector(".product-grid");
  grid.innerHTML = "";

  const targetSubcategory = db.subcategories.find(
    (sc) => sc.name === categoryName
  );
  if (!targetSubcategory) return;

  const filteredProducts = getAllProducts()
    .filter((p) => p.subcategoryId === targetSubcategory.subcategoryId)
    .map((p) => ({
      ...p,
      subcategory: db.subcategories.find(
        (sc) => sc.subcategoryId === p.subcategoryId
      ),
    }));

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const variantA = getPreferredVariant(a.variants);
    const variantB = getPreferredVariant(b.variants);

    // Nếu không có biến thể, đẩy xuống cuối danh sách
    if (!variantA && !variantB) return 0;
    if (!variantA) return 1;
    if (!variantB) return -1;

    const priceA = parsePrice(variantA.priceAfterDiscount || variantA.price);
    const priceB = parsePrice(variantB.priceAfterDiscount || variantB.price);

    switch (sortBy) {
      case "priceAsc":
        return priceA - priceB;
      case "priceDesc":
        return priceB - priceA;
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  // Render showcase
  const productsToShow = sortedProducts.slice(0, limit);
  productsToShow.forEach((product) => {
    const showcase = createShowcase(product);
    grid.appendChild(showcase);
  });
}

// ====== EVENT HANDLERS ======
document.addEventListener("DOMContentLoaded", function () {
  renderFilteredProducts({
    categoryName: "Đầm & váy",
    sortBy: "priceAsc",
    limit: 20,
  });
});

document
  .getElementById("grid-sort-header")
  .addEventListener("change", function (e) {
    const select = document.getElementById("grid-sort-header");
    let sortBy = select.value;

    switch (sortBy) {
      case "priceAsc default":
        sortBy = "priceAsc";
        break;
      case "priceDesc":
        sortBy = "priceDesc";
        break;
      case "newest":
        sortBy = "newest";
        break;
      case "oldest":
        sortBy = "oldest";
        break;
    }

    renderFilteredProducts({
      categoryName: "Đầm & váy",
      sortBy: sortBy,
      limit: 20,
    });
  });

// ====== PRODUCT DETAIL NAVIGATION ======
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".showcase-info").forEach((item) => {
    console.log("Navigating to product detail...");
    item.addEventListener("click", function () {
      console.log("Product clicked id product:", this.closest(".showcase").dataset.id);
      const productId = this.closest(".showcase").dataset.id;
      localStorage.setItem('selectedProductId', productId);
      window.location.href = './productDetail.html';
    });
  });
});
