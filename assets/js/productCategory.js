import { products, categories, subcategories } from "./productInfo.js";

window.products = products;
window.categories = categories;
window.subcategories = subcategories;

const targetSubcategory = subcategories.find((sc) => sc.name === "Đầm & váy");

const filteredProducts = products.filter(
  (p) => p.subCategoryId === targetSubcategory.id
);

function createShowcase(product) {
  const div = document.createElement("div");
  div.className = "showcase";

  // Gán data-* vào showcase
  div.dataset.id = product.productId;
  div.dataset.name = product.name;
  div.dataset.price = product.discountPrice;
  div.dataset.image = product.imageUrl[0];

  div.innerHTML = `

    <div class="showcase-banner">
        <img src="${product.imageUrl[0]}" alt="Đầm cổ tròn nhún tầng chân" class="product-img default" width="300">

        <img src="${product.imageUrl[1]}" alt="Đầm cổ tròn nhún tầng chân" class="product-img hover" width="300">
        
        <p class="showcase-badge angle pink">sale 50%</p>
    
        <div class="showcase-actions">
        <button class="btn-action">
            <ion-icon name="heart-outline" role="img" class="md hydrated" aria-label="heart outline"></ion-icon>
        </button>
    
        <button class="btn-action">
            <ion-icon name="eye-outline" role="img" class="md hydrated" aria-label="eye outline"></ion-icon>
        </button>
    
        <button class="btn-action">
            <ion-icon name="repeat-outline" role="img" class="md hydrated" aria-label="repeat outline"></ion-icon>
        </button>
    
        <button class="btn-action bag-add">
            <ion-icon name="bag-add-outline" role="img" class="md hydrated" aria-label="bag add outline"></ion-icon>
        </button>
        </div>
    </div>
    
    <div class="showcase-content">
        <a href="/productCategory.html" class="showcase-category">Đầm &amp; váy</a>

        <h3>
        <a href="/productDetail.html" class="showcase-title">${product.name}</a>
        </h3>
    
        <div class="showcase-rating">
        <ion-icon name="star" role="img" class="md hydrated" aria-label="star"></ion-icon>
        <ion-icon name="star" role="img" class="md hydrated" aria-label="star"></ion-icon>
        <ion-icon name="star" role="img" class="md hydrated" aria-label="star"></ion-icon>
        <ion-icon name="star-outline" role="img" class="md hydrated" aria-label="star outline"></ion-icon>
        <ion-icon name="star-outline" role="img" class="md hydrated" aria-label="star outline"></ion-icon>
        </div>
    
        <div class="price-box">
        <p class="price">${product.discountPrice} ₫</p>
        <del>${product.originalPrice} ₫</del>
        </div>
    
    </div>
    `;
  return div;
}

const container = document.querySelector(".container-product-category");
const grid = container.querySelector(".product-grid");

const amountLoopProduct = 3; // Số lần lặp lại sản phẩm

// Lặp lại sản phẩm trong mảng filteredProducts
for (let i = 0; i < amountLoopProduct; i++) {
  filteredProducts.forEach((product) => {
    const showcase = createShowcase(product);
    grid.appendChild(showcase);
  });
}
