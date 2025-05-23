import { products, categories, subcategories } from "./productInfo.js";
import { initSearchDropdown, setupSlider } from "./util.js";

window.products = products;
window.categories = categories;
window.subcategories = subcategories;

/*=== TÌM KIẾM SẢN PHẨM ===\
* Hàm khởi tạo dropdown tìm kiếm sản phẩm
\=========================*/
initSearchDropdown({
  inputSelector: ".search-field",
  resultsSelector: "#search-results",
  products,
});


// accordion: là chiếc đàn nó có thể mở ra và
// đóng lại thể hiện danh sách của các sản phẩm

// lấy biến thể hiện các phần tử
const accordionBtn = document.querySelectorAll("[data-accordion-btn]");
const accordion = document.querySelectorAll("[data-accordion]");

// Lặp thực thi từng node accordion
for (let i = 0; i < accordionBtn.length; i++) {
  // Thêm sự kiện click cho accordion
  accordionBtn[i].addEventListener("click", function () {
    // Kiểm tra xem accordion vừa click có 'active' hay không -> true / false
    const isActive = this.nextElementSibling.classList.contains("active");

    // Nếu accordion vừa click không có 'active' thì
    // đóng tất cả các accordion còn lại. -> đây là tính năng không phải bugs :'>
    if (!isActive) {
      for (let i = 0; i < accordion.length; i++) {
        accordion[i].classList.remove("active"); // xóa class active -> đóng accordion
        accordionBtn[i].classList.remove("active");
      }
    }

    // Bật/tắt accordion hiện tại
    this.nextElementSibling.classList.toggle("active");
    this.classList.toggle("active");
  });

  // Log mỗi lần gán event -> kiểm thử
  // console.log(`Đã gán click event cho accordionBtn[${i}]`);
}


/*=== SLIDER ===\
* Hàm khởi tạo slider 
\================*/

// Slider: Sản phẩm nổi bật
setupSlider({
  containerSel: ".slider-container",
  itemSel: ".slider-item",
  prevBtnSel: "#prevBtn",
  nextBtnSel: "#nextBtn",
  dotsContainerSel: ".slider-dots",
  delay: 5000, // tùy chỉnh auto-slide
});

// Slider: Ưu đãi trong ngày
setupSlider({
  containerSel: ".product-featured .showcase-wrapper",
  itemSel: ".product-featured .showcase-container",
  prevBtnSel: ".product-featured #prevBtn",
  nextBtnSel: ".product-featured #nextBtn",
  dotsContainerSel: ".product-featured .slider-dots",
  delay: 8000, // tùy chỉnh auto-slide
});

// Slider: Blog
setupSlider({
  containerSel: ".blog .blog-container",
  itemSel: ".blog .blog-card",
  prevBtnSel: ".blog #prevBtn",
  nextBtnSel: ".blog #nextBtn",
  dotsContainerSel: ".blog .slider-dots",
  delay: 5000, // tùy chỉnh auto-slid
});
