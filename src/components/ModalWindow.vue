<script setup lang="ts">
const props = defineProps<{ message: string }>();
const emits = defineEmits<{ (e: 'close'): void }>();
</script>

<template>
  <div class="backdrop">
    <div class="modal">
      <div class="modal_content">{{ props.message }}</div>
      <button class="close-button" @click="() => emits('close')">Close</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background: rgba(35, 35, 35, 0.918051);
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.modal {
  position: absolute;
  top: calc(50vh - 10rem);
  margin: 0 auto;
  border: 1px solid $color-border;
  width: 20rem;
  min-width: 280px;
  height: 10rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: $color-bg-primary;
  color: $color-text-primary;
  padding: 0 2rem;
}
.close-button {
  padding: 0.7rem 1.4rem;
  border-radius: 7px;
  align-self: flex-end;
}
</style>
