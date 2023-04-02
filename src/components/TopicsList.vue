<script setup lang="ts">
import { useStore } from 'vuex';
import { ACTIONS, key } from '@/store';
import { onBeforeMount, computed } from 'vue';
import { PATHS } from '@/types/types';

const emits = defineEmits<{ (e: 'click'): void }>();

const store = useStore(key);
const topics = computed(() => store.state.topics);
const topicIds = computed(() => store.getters.topicIds);

onBeforeMount(() => {
  if (!topicIds.value.length) {
    store.dispatch(ACTIONS.fetchTopics);
  }
});
</script>

<template>
  <nav class="topics">
    <div class="topics_header">
      <h4>All topics</h4>
    </div>
    <ul class="topics_list">
      <li v-for="id of topicIds" :key="id" class="topics_list-item">
        <RouterLink
          :to="`${PATHS.Chat}/${id}`"
          class="topics_link"
          active-class="__active"
          @click="() => emits('click')"
          >{{ topics[id] }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.topics {
  min-width: 16rem;
  min-height: 100%;
  background-color: $color-bg-secondary;
  z-index: 1;
  overflow-y: auto;

  &_header {
    height: 40px;
    display: inline-flex;
    align-items: center;
  }

  &_list {
    padding: 0 1rem;
    overflow: hidden;

    :first-child {
      a {
        border: none;
      }
    }
  }

  &_link {
    width: 100%;
    display: inline-block;
    padding: 0.7rem 1rem;
    text-align: start;
    border-top: 1px solid $color-border;
    border-radius: 0px;

    &:hover {
      transform: translateX(2px);
      transition: transform 0.2s ease;
    }
  }

  @media screen and (max-width: 480px) {
    position: absolute;
    display: none;
  }
}

.__active {
  border-radius: 5px;
  transition: all 0.2s ease;
  box-shadow: 0px 2px 4px rgba(44, 39, 56, 0.08);
  border: none;
  background-color: $color-bg-main;
  color: $color-text-secondary;
}
</style>
