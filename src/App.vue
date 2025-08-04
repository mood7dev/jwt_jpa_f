<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import GlobalModal from "./components/GlobalModal.vue";
</script>

<template>
  <Header />
  <router-view />
  <GlobalModal />
  <Footer />
</template>

<style scoped></style>
