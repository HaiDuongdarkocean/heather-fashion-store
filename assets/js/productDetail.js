import { updateCartCount } from "./util.js";

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
        color: showcase.querySelector(".color-picker-item.active")?.dataset.color || "default",
        size: showcase.querySelector(".size-picker-item.active")?.dataset.size || "default",
        quantity: parseInt(showcase.querySelector(".number-picker-input").value),
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
      alert("🛒 Sản phẩm đã được thêm vào giỏ!");
    });
  });
});

// window.addEventListener("load", () => {
//   localStorage.removeItem("cart-count");
// });
