<script setup>
import { reactive } from "vue";
import { login } from "@/services/accountService";
import { useRouter } from "vue-router";

const router = useRouter();

const state = reactive({
  form: {
    loginId: "",
    loginPw: "",
  },
});

//로그인 데이터 제출
const submit = async () => {
  const res = await login(state.form);

  switch (res.status) {
    case 200:
      await router.push("/");
      break;

    case 404:
      window.alert("아이디/비밀번호를 확인해 주세요.");
      break;
  }
};
</script>

<template>
  <div class="login">
    <div class="container">
      <form class="py-5" @submit.prevent="submit">
        <h1 class="h5 mb-3">로그인</h1>
        <div class="form-floating mb-3">
          <input
            type="email"
            class="form-control"
            id="loginId"
            placeholder="이메일"
            v-model="state.form.loginId"
          />
          <label for="loginId">이메일</label>
        </div>

        <div class="form-floating mb-3">
          <input
            type="password"
            class="form-control"
            id="loginPw"
            placeholder="패스워드"
            v-model="state.form.loginPw"
            autocomplete="off"
          />
          <label for="loginPw">패스워드</label>
        </div>

        <button type="submit" class="w-100 btn btn-primary">로그인</button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login > .container {
  max-width: 576px;
}
</style>
