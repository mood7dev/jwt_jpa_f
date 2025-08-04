<script setup>
import { useAccountStore } from "@/stores/account";
import { logout } from "@/services/accountService";
import { useRouter } from "vue-router";
import { useGlobalModalStore } from "@/stores/global-modal";

const modalStore = useGlobalModalStore();
const router = useRouter();
const account = useAccountStore();

//로그아웃
const logoutAccount = async () => {
  modalStore.setMessage("로그아웃 하시겠습니까?");
  modalStore.setConfirm(true, async () => {
    const res = await logout();
    if (res === undefined || res.status !== 200) {
      return;
    }
    account.logout();
    await router.push("/");
    modalStore.closeModal();
  });
  modalStore.open();
};
</script>

<template>
  <header>
    <div class="navbar navbar-dark bg-dark text-white shadow-sm">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <strong>Parfum de Rêve</strong>
        </router-link>
        <div class="menus d-flex gap-3">
          <template v-if="!account.state.isSigned">
            <router-link to="/login">로그인</router-link>
            <router-link to="/join">회원가입</router-link>
          </template>
          <template v-else>
            <a @click="logoutAccount">로그아웃</a>
            <router-link to="/orders">주문내역</router-link>
            <router-link to="/cart">장바구니</router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  .menus {
    a {
      cursor: pointer;
      color: #fff;
      text-decoration: none;
    }
  }
}
</style>
