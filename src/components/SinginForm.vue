<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { auth } from '@/api';
import router from '@/router';
import store, { ACTIONS } from '@/store';
import { Credits, PATHS } from '@/types/types';
import { reactive, ref } from 'vue';

const hasError = ref(false);
const loading = ref(false);
const credits = reactive<Credits>({ login: '', password: '' });

const handleSubmit = async () => {
  hasError.value = false;

  try {
    loading.value = true;

    await auth(credits);
    await store.dispatch(ACTIONS.fetchTopics);

    router.push(PATHS.Topics);
  } catch (error) {
    loading.value = false;
    hasError.value = true;
  }
};
</script>

<template>
  <div class="form-wrap">
    <div class="form-view">
      <header class="form-view__header">
        <h1 class="Head1">Sing in to Chat</h1>
      </header>
      <main class="form-view__content">
        <form @submit.prevent="() => handleSubmit()">
          <div class="text-field">
            <label
              ><span>Login</span>
              <input name="Login" type="text" tabindex="1" required v-model="credits.login" />
            </label>
          </div>
          <div class="text-field">
            <label
              ><span>Password</span>
              <input
                name="Password"
                type="password"
                tabindex="1"
                required
                v-model="credits.password"
              />
            </label>
          </div>
          <div class="submit-button">
            <button type="submit" :disabled="loading">
              <FontAwesomeIcon
                v-if="loading"
                icon="fa-solid fa-spinner"
                spin-pulse
                class="spinner"
              />
              <span v-else>Sing in</span>
            </button>
          </div>
          <span v-if="hasError" class="error-hint">Error occurred</span>
        </form>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-wrap {
  width: 100%;
  padding: 2rem 0;

  @media (min-width: 281px) {
    padding: 2rem 0.5rem;
  }
}
.form-view {
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  max-width: 25rem;
  min-width: 280px;
  min-height: 45vh;
  border-radius: 24px;
  background: $color-bg-main;
  box-shadow: 0px 12px 24px rgba(44, 39, 56, 0.02), 0px 32px 64px rgba(44, 39, 56, 0.04);

  &__header {
    display: block;
    margin: 0;
    width: 100%;
    color: $color-bg;
  }

  &__content {
    height: 100%;

    & form {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }
  }
}

.text-field {
  padding: 8px;

  label {
    display: block;
    font-size: 16px;
    color: $color-text-hint;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  input {
    display: block;
    padding: 16px;
    margin-top: 7px;
    margin-bottom: 8px;
    font-size: 16px;
    width: 100%;
    height: 52px;
    border-radius: 6px;
    border: 1px solid #dbe2ea;
    box-shadow: 0px 4px 8px 0px #2c27380a;
    color: #2c2738;

    &:focus {
      border: 2px solid $color-bg-primary;
    }
    &::placeholder {
      color: #7c9cbf;
    }
  }
}

.submit-button {
  position: relative;
  z-index: 1;
  padding: 8px;
  button {
    position: relative;
    z-index: 1;
    height: 56px;
    width: 100%;
    background: $color-bg-primary;
    box-shadow: 0px 2px 4px rgba(44, 39, 56, 0.08), 0px 4px 8px rgba(44, 39, 56, 0.08);
    border-radius: 6px;
    color: $color-text-primary;
    font-size: 16px;
  }
  button:not(:disabled):hover {
    border: 2px solid $color-inactive;
  }
  button:disabled {
    color: $color-inactive;
    mix-blend-mode: normal;
    opacity: 0.5;
    background: $color-border;
    box-shadow: 0px 4px 8px rgba(44, 39, 56, 0.08);
  }
}

.error-hint {
  color: $color-error;
}
.spinner {
  font-size: 1.5em;
}
</style>
