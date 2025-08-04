<script setup></script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="logo">🛍 Hello,Home</div>
        <nav class="links">
          <a href="/about">회사소개</a>
          <a href="/policy">이용약관</a>
          <a href="/privacy">개인정보처리방침</a>
          <a href="/contact">문의하기</a>
        </nav>
        <div class="copy">© 2025 MyShop. All rights reserved.</div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: #212529;
  border-top: 1px solid #f8f9fa;
  padding: 30px 0;
  font-size: 14px;
  color: #fff;
  margin-top: 50px;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .logo {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .links {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 15px;

      a {
        color: #fff;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
          color: #007bff;
        }
      }
    }

    .copy {
      font-size: 13px;
      color: #fff;
    }
  }
}
</style>
