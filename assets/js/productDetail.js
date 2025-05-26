import { updateCartCount } from "./util.js";
import { getProductDetailsById } from "./productBll.js";

document.addEventListener("DOMContentLoaded", function () {
  const productId = localStorage.getItem("selectedProductId");
  if (!productId) return;

  const product = getProductDetailsById(productId);
  if (!product) return;
  // Render chi tiết sản phẩm
  console.log("Rendering product detail for:", product);
  // localStorage.removeItem('selectedProductId'); // Xóa ID sau khi đã sử dụng
  renderProductDetail(product);
});

function renderProductDetail(product) {
  const container = document.getElementById("product-detail");
  console.log("Rendering product detail in container:", container);
  // Lấy các giá trị cần thiết
  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];
  const allColors = [...new Set(product.variants.map((v) => v.color))];
  const allSizes = [...new Set(product.variants.map((v) => v.size))];
  const totalStock = product.variants.reduce(
    (sum, v) => sum + v.stockQuantity,
    0
  );

  container.innerHTML = `
  <div class="showcase" 
    data-id="${product.productId}" 
    data-name="${product.name}" 
    data-price="${defaultVariant.priceAfterDiscount || defaultVariant.price}" 
    data-image="${product.imageUrls[0]}"
    data-color="${defaultVariant.color}"
    data-size="${defaultVariant.size}"
    data-sku="${defaultVariant.sku}">
    <div class="wrapper-img">
      <div class="product-img-main has-scrollbar">
        <img src="${product.imageUrls[0]}" alt="${product.name}" class="showcase-img">
      </div>
    </div>
    <div class="showcase-content">
      <div>
        <a href="#">
          <h3 class="showcase-title">${product.name}</h3>
        </a>
        <div class="showcase-rating">
          <ion-icon name="star"></ion-icon>
          <ion-icon name="star"></ion-icon>
          <ion-icon name="star"></ion-icon>
          <ion-icon name="star-outline"></ion-icon>
          <ion-icon name="star-outline"></ion-icon>
        </div>
      </div>
      <p class="showcase-desc">${product.description}</p>
      <div class="price-box">
        <p class="price">${
          defaultVariant.priceAfterDiscount || defaultVariant.price
        } ₫</p>
        <del>1.900.000 ₫</del>
      </div>
      <div class="attr">
        <div class="color-picker">
          <p class="title m-0 p-0 fw-500">Màu sắc:</p>
          <div class="flex">
            ${allColors
              .map(
                (color) => `
              <div class="color-picker-item${
                color === defaultVariant.color ? " active" : ""
              }" data-color="${color}" style="background:${color};">${color}</div>
            `
              )
              .join("")}
          </div>
        </div>
        <div class="size-picker">
          <p class="title m-0 p-0 fw-500">Size:</p>
          <div class="flex">
            ${allSizes
              .map(
                (size) => `
              <button class="size-picker-item${
                size === defaultVariant.size ? " active" : ""
              }" data-size="${size}">${size.toUpperCase()}</button>
            `
              )
              .join("")}
          </div>
        </div>
        <div class="number-picker">
          <p class="title m-0 p-0 fw-500">Số lượng:</p>
          <div id="product-number" class="flex">
            <button class="number-picker-btn" data-number-picker-btn="decrease">-</button>
            <input type="number" name="quantity" class="number-picker-input" value="1" min="1">
            <button class="number-picker-btn" data-number-picker-btn="increase">+</button>
          </div>
        </div>
      </div>
      <div class="container-product-btn">
        <div class="heart-action">
          <ion-icon name="heart" class="md hydrated heart hidden"></ion-icon>
          <ion-icon name="heart-outline" class="md hydrated heart"></ion-icon>
        </div>
        <button class="add-cart-btn modfify-add-cart-btn">Thêm vào giỏ</button>
        <a href="/cart.html"><button class="add-cart-btn buy-btn">Mua ngay</button></a>
      </div>
      <div class="showcase-status">
        <div class="wrapper">
          <p>Đã bán: <b>20</b></p>
          <p>Còn lại: <b>${totalStock}</b></p>
        </div>
        <div class="showcase-status-bar"></div>
      </div>
    </div>
  </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  // Color Picker
  document.querySelectorAll(".color-picker-item").forEach((item) => {
    item.addEventListener("click", () => {
      document
        .querySelectorAll(".color-picker-item")
        .forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // Size Picker
  document.querySelectorAll(".size-picker-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".size-picker-item")
        .forEach((i) => i.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});

// Chọn số lượng sản phẩm
document.addEventListener("DOMContentLoaded", () => {
  const picker = document.querySelector(".number-picker");
  const input = picker.querySelector(".number-picker-input");
  const btnDecrease = picker.querySelector(
    '[data-number-picker-btn="decrease"]'
  );
  const btnIncrease = picker.querySelector(
    '[data-number-picker-btn="increase"]'
  );

  // Hàm update số lượng
  const updateQuantity = (delta) => {
    let current = parseInt(input.value, 10) || 1;
    let newValue = current + delta;
    input.value = Math.max(newValue, 1); // không cho nhỏ hơn 1
  };

  // Sự kiện nút trừ
  btnDecrease.addEventListener("click", () => updateQuantity(-1));

  // Sự kiện nút cộng
  btnIncrease.addEventListener("click", () => updateQuantity(1));

  // Kiểm tra input khi người dùng gõ tay
  input.addEventListener("input", () => {
    let val = parseInt(input.value, 10);
    input.value = isNaN(val) || val < 1 ? 1 : val;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".modfify-add-cart-btn");

  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const showcase = btn.closest(".showcase");

      const product = {
        id: showcase.dataset.id,
        name: showcase.dataset.name,
        price: parseFloat(showcase.dataset.price.replace(/\./g, "")),
        image: showcase.dataset.image,
        color:
          showcase.querySelector(".color-picker-item.active")?.dataset.color ||
          "default",
        size:
          showcase.querySelector(".size-picker-item.active")?.dataset.size ||
          "default",
        quantity: parseInt(
          showcase.querySelector(".number-picker-input").value
        ),
      };

      // Kiểm tra nếu chưa có cart, thì tạo mảng mới
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Tìm sản phẩm đã có (cùng id + color + size)
      const existingIndex = cart.findIndex(
        (item) =>
          item.id === product.id &&
          item.color === product.color &&
          item.size === product.size
      );

      if (existingIndex > -1) {
        // Nếu đã có, thì cộng dồn số lượng
        cart[existingIndex].quantity += product.quantity;
        console.log(cart[existingIndex]);
      } else {
        // Nếu chưa có, thêm mới
        cart.push(product);
        console.log(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      console.log(JSON.stringify(cart));
    });
  });
});
