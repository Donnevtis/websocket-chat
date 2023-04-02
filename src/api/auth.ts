import { Credits, TokenData } from '@/types/types';
import { utf8ToB64 } from '@/utils';
import axios from 'axios';
import { decodeJwt } from 'jose';
import { initTokenData } from '@/utils/constants';

export const auth = async ({ login, password }: Credits) =>
  axios
    .post<string>(process.env.VUE_APP_AUTH_URL, {
      login: utf8ToB64(login),
      password: utf8ToB64(password),
    })
    .then(({ data }) =>
      //without refresh-token, jwt will have to be stored unsafe either in a local storage or in a cookie file.
      {
        const { exp, iat } = getTokenData(data);

        if (exp && iat) {
          document.cookie = `token=${data}; max-age=${exp - iat}; path=/`;
        } else {
          throw new Error('Token is invalid');
        }
      },
    );

export const getToken = () => document.cookie.match(/token=([^;]*)/)?.[1];

export const getTokenData = (token = getToken()): TokenData => {
  return (token && decodeJwt(token)) || initTokenData;
};

export const hasToken = () => {
  return Boolean(getToken());
};

export const logout = () => {
  document.cookie = 'token=; max-age=0; path=/';
};
