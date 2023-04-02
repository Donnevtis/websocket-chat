import { Topics } from '@/types/types';
import axios from 'axios';
import { getToken, getTokenData } from './auth';

export const getTopics = () =>
  axios
    .get<{ result: { topics: Topics } }>(process.env.VUE_APP_TOPICS_URL, {
      params: { token: getToken(), login: getTokenData().sub },
    })
    .then(({ data }) => data.result.topics);
