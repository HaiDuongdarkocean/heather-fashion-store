import { updateCartCount } from "./util.js";

function renderCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  const container = document.querySelector(".cart-items-container");
  container.innerHTML = cartItems
    .map(
      (item) => `
    <div class="cart-row cart-item">
      <div class="cart-col image flex jcCenter">
        <img src="${item.image}" alt="Sản phẩm">
      </div>
      <div class="cart-col info">
        <p class="product-name">${item.name}</p>
        <p class="product-desc">Size ${item.size}, Màu ${item.color}</p>
      </div>
      <div class="cart-col price">
        <span class="product-price" data-price="${
          item.price
        }">${item.price.toLocaleString("vi-VN")}₫</span>
      </div>
      <div class="cart-col quantity">
        <div class="number-picker">
          <button class="number-picker-btn" data-number-picker-btn="decrease">-</button>
          <input type="number" class="number-picker-input" value="${
            item.quantity
          }" min="1">
          <button class="number-picker-btn" data-number-picker-btn="increase">+</button>
        </div>
      </div>
      <div class="cart-col option center">Gỡ</div>
    </div>
  `
    )
    .join("");
}

// Gọi hàm này khi trang load
document.addEventListener("DOMContentLoaded", renderCartItems);

document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cart-layout");

  const updateSummary = () => {
    const rows = cartContainer.querySelectorAll(".cart-row:not(.cart-header)");
    let subtotal = 0;

    rows.forEach((row) => {
      const price = parseInt(row.querySelector(".product-price").dataset.price);
      const quantity = parseInt(
        row.querySelector(".number-picker-input").value
      );
      subtotal += price * quantity;
    });

    const discount = 0;
    const tempTotal = subtotal - discount;
    const finalTotal = tempTotal;

    cartContainer.querySelector(".subtotal").textContent =
      subtotal.toLocaleString("vi-VN") + "₫";
    cartContainer.querySelector(".discount").textContent =
      discount.toLocaleString("vi-VN") + "₫";
    cartContainer.querySelector(".temp-total").textContent =
      tempTotal.toLocaleString("vi-VN") + "₫";
    cartContainer.querySelector(".final-total").textContent =
      finalTotal.toLocaleString("vi-VN") + "₫";
  };

  cartContainer.addEventListener("click", (e) => {
    if (e.target.matches(".number-picker-btn")) {
      const input = e.target.parentElement.querySelector(
        ".number-picker-input"
      );
      let value = parseInt(input.value) || 1;

      if (e.target.dataset.numberPickerBtn === "increase") {
        input.value = value + 1;
      } else {
        input.value = Math.max(value - 1, 1);
      }

      updateSummary();
    }
  });

  cartContainer.addEventListener("input", (e) => {
    if (e.target.matches(".number-picker-input")) {
      let value = parseInt(e.target.value);
      e.target.value = isNaN(value) || value < 1 ? 1 : value;
      updateSummary();
    }
  });

  document
    .querySelector(".cart-items-container")
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("option")) {
        const row = e.target.closest(".cart-row");
        const name = row.querySelector(".product-name").textContent.trim();
        const desc = row.querySelector(".product-desc").textContent.trim();
        
        // Tách size và màu từ desc
        const size = desc.match(/Size ([^,]+)/)[1].trim();
        const color = desc.match(/Màu (.+)/)[1].trim();

        // Lấy cart từ localStorage
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        // Xóa đúng item
        cart = cart.filter(
          (item) =>
            !(item.name === name && item.size === size && item.color === color)
        );
        localStorage.setItem("cart", JSON.stringify(cart));
        // Render lại cart và cập nhật tổng tiền
        renderCartItems();
        updateSummary();
        updateCartCount();
      }
    });

  updateSummary();
});

// layout đặt hàng thành công
document.getElementById("place-order").addEventListener("click", () => {
  const quantities = document.querySelectorAll(".number-picker-input");
  let totalItems = 0;

  quantities.forEach((input) => {
    totalItems += parseInt(input.value);
  });

  document.getElementById("totalItems").textContent = totalItems;
  document.getElementById("successModal").classList.add("active");
});

document.getElementById("buy-more").addEventListener("click", () => {
  window.location.href = "/"; // hoặc window.location.href = '/products'
});

document
  .querySelector("#successModal .btn-primary")
  .addEventListener("click", () => {
    window.location.href = "/"; // hoặc window.location.href = '/products'
  });

//buySuccessClose
document.getElementById("buySuccessClose").addEventListener("click", () => {
  document.getElementById("successModal").classList.remove("active");

  // clear cart
  localStorage.removeItem("cart");
  updateCartCount();

  // Redirect to home or products page
  window.location.href = "/"; // hoặc window.location.href = '/products'
});