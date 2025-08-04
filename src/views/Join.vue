<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { join } from "@/services/accountService";

const router = useRouter();

const state = reactive({
  form: {
    name: "",
    loginId: "",
    loginPw: "",
  },
});

const submit = async () => {
  const res = await join(state.form);
  console.log("res: ", res);
  if (res.status === 200) {
    alert("회원가입을 축하합니다");
    await router.push("/");
  }
};
</script>

<template>
  <div class="join">
    <div class="container">
      <form class="py-5" @submit.prevent="submit">
        <h1 class="h5 mb-3">회원가입</h1>

        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder="이름"
            v-model="state.form.name"
          />
          <label for="name">이름</label>
        </div>

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
            id="password"
            placeholder="패스워드"
            v-model="state.form.loginPw"
            autocomplete="off"
          />
          <label for="loginPw">패스워드</label>
        </div>

        <button type="submit" class="w-100 btn btn-primary">회원가입</button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.join > .container {
  max-width: 576px;
}
</style>
