<script setup lang="ts">
import { getTokenData } from '@/api';
import router from '@/router';
import { ACTIONS, key } from '@/store';
import { ChatMessage, MyMessage, PATHS, WebSocketMessage, WS_CLOSE_CODE } from '@/types/types';
import { useIdle } from '@/use/idle';
import { randomId, sortMessages, waitWSPing } from '@/utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, onBeforeUnmount, watch, ref, reactive, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import ModalWindow from './ModalWindow.vue';

const sockets: WebSocket[] = [];
const { sub } = getTokenData();

const store = useStore(key);
const route = useRoute();
const topicId = computed(() => (Array.isArray(route.params.id) ? NaN : Number(route.params.id)));
const topicName = computed(() => store.state.topics[topicId.value]);

useIdle(() => router.push(PATHS.Topics), 3);

const order = ref(0);
const error = ref('');
const message = ref('');
const loading = ref(true);
const online = ref(false);
const showModal = ref(false);
const messages = reactive<{ [key: number]: ChatMessage[] }>({
  [topicId.value]: [],
});
const lastMessageRef = ref<HTMLDivElement | null>(null);

const connect = (id: number | null) => {
  if (!id || sockets[id]) {
    return;
  }

  loading.value = !messages[id]?.length;

  const socket = (sockets[id] = new WebSocket(process.env.VUE_APP_WS_URL));

  const payload = JSON.stringify({
    login: sub,
    topics: id,
  });

  socket.addEventListener(
    'error',
    () => {
      error.value = 'Server not responding';
      showModal.value = true;
    },
    { once: true },
  );

  socket.addEventListener(
    'close',
    async ({ code }) => {
      online.value = false;

      if (code !== WS_CLOSE_CODE.Clean) {
        await waitWSPing();

        socket.close();
        delete sockets[id];
        connect(id);
        store.dispatch(ACTIONS.fetchTopics);
      }
    },
    { once: true },
  );

  socket.addEventListener(
    'open',
    () => {
      socket.send(payload);
      online.value = true;
    },
    { once: true },
  );

  socket.addEventListener('message', async ({ data }) => {
    const webSocketMessage = JSON.parse(data) as WebSocketMessage;

    if ('message' in webSocketMessage) {
      messages[id].push(webSocketMessage);

      return;
    }

    loading.value = false;
    const { result } = webSocketMessage;

    if (!result.length) {
      error.value = 'The conversation is empty';
      showModal.value = true;

      return;
    }

    messages[id] = sortMessages(result);
    order.value = result.length % 2;
  });
};

const sendMessage = () => {
  if (!sub || !topicId.value || !message.value.length) {
    return;
  }

  const topics = topicId.value;

  const myMessage: MyMessage = {
    login: sub,
    topics,
    message: message.value,
  };

  sockets[topics].send(JSON.stringify(myMessage));

  const chatMessage = {
    login: sub,
    message: message.value,
    id: randomId(),
  };

  messages[topics].push(chatMessage);
  message.value = '';
};

onMounted(() => connect(topicId.value));

onBeforeUnmount(() => {
  sockets.filter(Boolean).forEach(socket => socket.close());
  sockets.length = 0;
});

watch(
  () => route.params.id,
  () => {
    connect(topicId.value);
  },
);

watch(
  () => messages[topicId.value],
  async () => {
    await nextTick();

    const lastMessage = lastMessageRef.value;

    if (lastMessage) {
      lastMessage.scrollIntoView();
    }
  },
  {
    deep: true,
  },
);
</script>

<template>
  <div class="chat">
    <div class="chat_header">
      <FontAwesomeIcon icon="fa-regular fa-message" />
      <div class="chat_topic">
        <h3>{{ topicName }}</h3>
        <span v-show="online" class="chat_status">active</span>
      </div>
      <RouterLink :to="PATHS.Topics" class="chat_close-link">Close</RouterLink>
    </div>
    <div v-if="!loading" class="chat_area">
      <div
        v-for="({ message, id }, index) in messages[topicId]"
        class="message"
        :key="id"
        :class="!(order ^ index % 2) && 'message__my'"
      >
        <p
          class="message_bubble"
          :ref="
            elem => {
              if (elem && index === messages[topicId].length - 1) {
                lastMessageRef = elem as HTMLDivElement;
              }
            }
          "
        >
          {{ message }}
        </p>
      </div>
    </div>
    <div v-else class="chat_area">
      <div class="chat_spinner">
        <FontAwesomeIcon icon="fa-solid fa-spinner" spin-pulse />
      </div>
    </div>
    <div class="chat-action">
      <form @submit.prevent="() => sendMessage()" class="container">
        <input
          type="text"
          placeholder="Write a message"
          class="chat-action_input"
          v-model="message"
          :disabled="!online"
        />
        <button type="submit" class="chat-action_submit" :disabled="!online">
          <FontAwesomeIcon v-if="online" icon="fa-regular fa-paper-plane" />
          <FontAwesomeIcon v-else icon="fa-solid fa-spinner" spin-pulse />
        </button>
      </form>
    </div>
  </div>
  <ModalWindow v-if="showModal" :message="error" @close="() => (showModal = false)" />
</template>

<style scoped lang="scss">
.chat {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: $color-bg-main;
  border-radius: 10px;
  overflow: hidden;

  &_header {
    display: inline-flex;
    background-color: $color-bg-primary;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    height: 65px;
    width: 100%;
    padding: 1rem;
  }

  &_topic {
    display: flex;
    flex-direction: column;
    position: relative;
    min-width: 1rem;
    height: 100%;
  }

  &_status {
    position: absolute;
    top: 1rem;
    line-height: 200%;
    font-size: small;
  }

  &_close-link {
    color: $color-text-secondary;
    justify-self: end;
    right: 0;
  }

  &_area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    flex: 1;
    overflow: auto;
    padding: 1rem;
  }

  &_spinner {
    font-size: 4em;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.chat-action {
  padding: 1rem;
  .container {
    display: inline-flex;
    border: 1px solid $color-border;
    border-radius: 10px;
    padding-left: 0.3rem;
    overflow: hidden;
    width: 100%;
  }
  &_input {
    padding: 8px;
    flex-grow: 1;

    &::placeholder {
      color: #7c9cbf;
    }
  }

  &_submit {
    padding: 0 0.5rem;
    background-color: $color-bg-primary;
    color: $color-text-primary;

    &:hover {
      opacity: 0.8;
    }
  }
}
.message {
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: start;
  max-width: 85%;

  &_bubble {
    border: 1px solid $color-border;
    border-radius: 0 10px 10px 10px;
    padding: 1rem;
    overflow-wrap: break-word;
    max-width: 100%;
  }

  &__my {
    align-self: end;

    .message_bubble {
      border-radius: 10px 0 10px 10px;
    }
  }
}
</style>
