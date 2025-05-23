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

document.querySelector("#successModal .btn-primary").addEventListener("click", () => {
  window.location.href = "/"; // hoặc window.location.href = '/products'
});
