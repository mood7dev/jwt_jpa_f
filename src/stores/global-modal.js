import { defineStore } from "pinia";
import { reactive } from "vue";

export const useGlobalModalStore = defineStore("global-modal", () => {
  const state = reactive({
    message: "",
    isShow: false, // 여기 isShow로 변경
    isConfirm: false,
    onConfirm: null,
  });

  function setMessage(msg) {
    state.message = msg;
  }

  function setConfirm(isConfirm, confirmCallback) {
    state.isConfirm = isConfirm;
    state.onConfirm = confirmCallback || null;
  }

  function open() {
    state.isShow = true; // isOpen -> isShow 변경
  }

  function closeModal() {
    // close -> closeModal 으로 변경
    state.isShow = false;
    state.onConfirm = null;
  }

  return { state, setMessage, setConfirm, open, closeModal };
});
