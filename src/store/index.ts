import { getTopics } from '@/api';
import { Topics } from '@/types/types';
import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

export interface State {
  topics: Topics;
}

export enum ACTIONS {
  fetchTopics = 'fetchTopics',
}

export enum MUTATIONS {
  setTopics = 'setTopics',
}

export const key: InjectionKey<Store<State>> = Symbol();

export default createStore({
  state: {
    topics: {},
  },
  getters: {
    topicIds(state): string[] {
      return Object.keys(state.topics);
    },
  },
  mutations: {
    [MUTATIONS.setTopics](state, topics) {
      state.topics = topics;
    },
  },
  actions: {
    [ACTIONS.fetchTopics]({ commit }) {
      return getTopics().then(topics => commit(MUTATIONS.setTopics, topics));
    },
  },
});
