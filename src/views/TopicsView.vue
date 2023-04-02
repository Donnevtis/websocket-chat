<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import TopicsList from '@/components/TopicsList.vue';
import { ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { getTokenData } from '@/api';
import { PATHS } from '@/types/types';

const { path } = useRoute();

const showNav = ref(path === PATHS.Topics);

onBeforeRouteUpdate(({ path }) => {
  showNav.value = path === PATHS.Topics;
});

const { name } = getTokenData();
</script>
<template>
  <div class="topics-wrap">
    <TopicsList @click="() => (showNav = false)" :class="showNav && '__show'" />
    <main class="chat-view">
      <header class="header">
        <a class="header_menu" @click="() => (showNav = !showNav)">
          <FontAwesomeIcon icon="fa-solid fa-bars" />
        </a>
        <span>{{ name }}</span>
        <RouterLink :to="PATHS.Logout" class="header_logout">
          <FontAwesomeIcon icon="fa-solid fa-right-from-bracket"
        /></RouterLink>
      </header>
      <RouterView />
    </main>
  </div>
</template>
<style scoped lang="scss">
.topics-wrap {
  width: 100vw;
  height: 100vh;
  display: inline-flex;
}
.chat-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: 0 1rem 1rem;
}

.header {
  display: inline-flex;
  justify-content: flex-end;
  width: 100%;
  padding: 1rem;
  gap: 1rem;
  color: $color-text-primary;

  &_menu {
    display: none;
  }

  &_login {
    display: inline-flex;
    justify-content: space-between;
    width: 8rem;
    color: $color-text-primary;
  }

  &_logout {
    color: $color-text-primary;

    &:hover {
      color: $color-text-hint;
    }
  }

  @media screen and (max-width: 480px) {
    justify-content: space-between;

    &_menu {
      display: inline;
    }
  }
}

.__show {
  display: block;
}
</style>
