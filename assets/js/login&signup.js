const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () =>{
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () =>{
    container.classList.remove("sign-up-mode");
});

// Đang nhập tài khoản phân quyền admin và user
document.querySelector('.sign-in-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Ngăn reload trang

    const username = document.querySelector('.sign-in-form input[type="text"]').value.trim();
    const password = document.querySelector('.sign-in-form input[type="password"]').value;

    // Kiểm tra tài khoản và mật khẩu
    // Mẹo dùng ta dùng if else nếu có khoảng 3 điều kiện
    // Nếu có nhiều điều kiện hơn thì dùng switch case
    if (username === 'admin' && password === '123') {
      window.location.href = '/admin.html';
    } else if (username === 'user' && password === '123') {
      window.location.href = '/';
    } else {
      alert('Sai tài khoản hoặc mật khẩu!');
    }
  });