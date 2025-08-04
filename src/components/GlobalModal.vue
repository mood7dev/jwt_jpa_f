<template>
  <div
    class="modal fade"
    tabindex="-1"
    role="dialog"
    :class="{ show: modalStore.state.isShow }"
    :style="{ display: modalStore.state.isShow ? 'block' : 'none' }"
    @click.self="modalStore.closeModal"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">알림</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="modalStore.closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ modalStore.state.message }}</p>
        </div>
        <div class="modal-footer">
          <button
            v-if="modalStore.state.isConfirm"
            type="button"
            class="btn btn-primary"
            @click="onConfirmClick"
          >
            확인
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="modalStore.closeModal"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGlobalModalStore } from "@/stores/global-modal";

const modalStore = useGlobalModalStore();

function onConfirmClick() {
  if (modalStore.state.onConfirm) {
    modalStore.state.onConfirm();
  }
  modalStore.closeModal();
}
</script>
