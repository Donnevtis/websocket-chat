import { ChatMessage } from '@/types/types';
import { customAlphabet } from 'nanoid';

export const utf8ToB64 = (str: string): string => window.btoa(str);

export const sortMessages = (messages: ChatMessage[]) =>
  messages.sort(({ id: a }, { id: b }) => a - b);

export const randomId = () => {
  const nanoid = customAlphabet('1234567890', 5);

  return Number(nanoid());
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(func: T, delay = 150): T => {
  let pass = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debounced = (...args: any[]) => {
    if (pass) {
      return;
    }

    pass = true;

    func(...args);

    setTimeout(() => {
      pass = false;
    }, delay);
  };

  return <T>debounced;
};

export const waitWSPing = async (interval = 5000) => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await fetch(process.env.VUE_APP_WS_PING);
      break;
    } catch {
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
};
