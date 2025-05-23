/*=== TÌM KIẾM SẢN PHẨM ===\
* Khởi tạo dropdown tìm kiếm tự động dựa trên dữ liệu sản phẩm truyền vào
\=========================*/
export function initSearchDropdown({
  inputSelector,
  resultsSelector,
  products,
}) {
  // Tìm phần tử ô nhập liệu từ selector được truyền vào
  const searchInput = document.querySelector(inputSelector);

  // Tìm phần tử container hiển thị kết quả từ selector được truyền vào
  const resultsContainer = document.querySelector(resultsSelector);

  // Nếu không tìm thấy phần tử ô nhập hoặc container kết quả thì cảnh báo và dừng hàm
  if (!searchInput || !resultsContainer) {
    console.warn("SearchDropdown: missing input or results container.");
    return;
  }

  // Xử lý khi người dùng nhập dữ liệu vào ô tìm kiếm
  function handleSearchInput(event) {
    const query = event.target.value.trim().toLowerCase(); // Lấy nội dung nhập, xóa khoảng trắng, chuyển về chữ thường
    clearResults(); // Xóa kết quả cũ trước khi hiển thị mới

    if (query.length === 0) return; // Nếu không nhập gì thì không tìm kiếm

    const filtered = filterProducts(query); // Lọc sản phẩm phù hợp với từ khóa
    renderResults(filtered); // Hiển thị danh sách sản phẩm phù hợp
  }

  // Lọc sản phẩm có chứa từ khóa trong tên sản phẩm
  function filterProducts(query) {
    return products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }

  // Xóa toàn bộ kết quả đang hiển thị
  function clearResults() {
    resultsContainer.innerHTML = "";
  }

  // Hiển thị danh sách kết quả tìm kiếm phù hợp
  function renderResults(filteredProducts) {
    filteredProducts.forEach((product) => {
      const li = document.createElement("li"); // Tạo thẻ <li> cho từng sản phẩm
      li.textContent = product.name; // Gán tên sản phẩm vào nội dung thẻ
      li.classList.add("dropdown-item"); // Thêm class để định dạng style

      // Gán sự kiện click để điều hướng đến trang sản phẩm
      li.addEventListener("click", () => {
        navigateToProduct(product.url);
      });

      resultsContainer.appendChild(li); // Thêm <li> vào danh sách kết quả
    });
  }

  // Chuyển hướng trình duyệt sang URL sản phẩm
  function navigateToProduct(url) {
    window.location.href = url;
  }

  // Thiết lập sự kiện click ra ngoài vùng input để ẩn dropdown
  function setupOutsideClickHandler() {
    document.addEventListener("click", (e) => {
      // Nếu click không nằm trong vùng input (ví dụ: click ra ngoài) thì xóa kết quả
      if (!e.target.closest(inputSelector)) {
        clearResults();
      }
    });
  }

  // === Giai đoạn khởi tạo ===

  // Lắng nghe sự kiện người dùng gõ vào ô tìm kiếm
  searchInput.addEventListener("input", handleSearchInput);

  // Kích hoạt logic ẩn kết quả khi click ra ngoài vùng tìm kiếm
  setupOutsideClickHandler();
}

/* === SLIDERS ===\
* Hàm tạo slider tự động
  container slider cần position: relative

  <!-- Nút trái -->
  <button id="prevBtn" class="slider-arrow left">‹</button>

  <!-- Slider -->
  <div class="slider-container">...</div>

  <!-- Nút phải -->
  <button id="nextBtn" class="slider-arrow right">›</button>

  <!-- Chấm điều hướng slider -->
  <div class="slider-dots"></div> 
\=================*/
export function setupSlider({
  containerSel,
  itemSel,
  prevBtnSel,
  nextBtnSel,
  dotsContainerSel,
  delay = 3000,
}) {
  const container = document.querySelector(containerSel);
  const dotsContainer = document.querySelector(dotsContainerSel);

  // kiểm tra xem có tồn tại container và dotsContainer không
  if (!container || !dotsContainer) {
    console.warn("setupSlider: Missing container or dots container.");
    return;
  }

  const items = container.querySelectorAll(itemSel);
  
  // kiểm tra xem có tồn tại item không
  if (items.length === 0) {
    console.warn("setupSlider: No slider items found.");
    return;
  }
  const totalItems = items.length;
  const containerWidth = container.clientWidth;
  const itemWidth = items[0].clientWidth;
  const groupSize = Math.floor(containerWidth / itemWidth); // số item mỗi lần slide
  const groupCount = Math.ceil(totalItems / groupSize); // số dot
  let currentIndex = 0;
  let autoSlide;

  const dots = createDots(dotsContainer, groupCount, goToSlide);

  /**
   * Tạo các chấm điều hướng dựa trên số nhóm slide
   * @param {HTMLElement} container - nơi chứa các dot
   * @param {number} groupCount - số nhóm (dựa trên totalItems / step)
   * @param {(index: number) => void} onDotClick - hàm xử lý khi click dot
   * @returns {HTMLElement[]} danh sách chấm điều hướng
   */
  function createDots(container, groupCount, onDotClick) {
    container.innerHTML = "";
    const dotElements = [];

    for (let i = 0; i < groupCount; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        onDotClick(i);
        restartAutoSlide();
      });

      container.appendChild(dot);
      dotElements.push(dot);
    }

    return dotElements;
  }

  function updateDots(groupIndex) {
    dots.forEach((dot, i) => dot.classList.toggle("active", i === groupIndex));
  }

  function goToSlide(dotIndex) {
    const scrollAmount = itemWidth * groupSize * dotIndex;
    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
    updateDots(dotIndex);
    currentIndex = dotIndex;
  }

  function goToNext() {
    const nextIndex = (currentIndex + 1) % groupCount;
    goToSlide(nextIndex);
  }

  function goToPrev() {
    const prevIndex = (currentIndex - 1 + groupCount) % groupCount;
    goToSlide(prevIndex);
  }

  function restartAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(goToNext, delay);
  }

  function setupArrowButtons(prevSel, nextSel) {
    const prevBtn = document.querySelector(prevSel);
    const nextBtn = document.querySelector(nextSel);

    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        goToPrev();
        restartAutoSlide();
      });

    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        goToNext();
        restartAutoSlide();
      });
  }

  // Init
  setupArrowButtons(prevBtnSel, nextBtnSel);
  goToSlide(0);
  restartAutoSlide();
}




/* === THÊM SẢN PHẨM VÀO GIỎ HÀNG ===\
* Hàm thêm sản phẩm vào giỏ hàng
* Lưu ý: Giỏ hàng được lưu trong localStorage
* Sử dụng hàm này trong các file JS của trang sản phẩm
\===================================*/
document.addEventListener("click", function (e) {
  if (e.target.closest(".bag-add")) {
    const showcase = e.target.closest(".showcase");

    const id = showcase.dataset.id;
    const name = showcase.dataset.name;
    const price = parseInt(showcase.dataset.price);
    const image = showcase.dataset.image;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }
});

export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("count-cart").textContent = count;
  console.log("Số lượng sản phẩm trong giỏ hàng:", count);
}

// Gọi sau khi load trang
updateCartCount();