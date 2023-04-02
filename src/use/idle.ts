import { debounce } from '@/utils';
import { onBeforeUnmount, onMounted } from 'vue';

export const useIdle = (callback: () => void, countDownMinutes = 10) => {
  let timeout: number;

  const resetTimer = debounce(() => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, countDownMinutes * 60 * 1e3);
  });

  onMounted(() => {
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    resetTimer();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', resetTimer);
    window.removeEventListener('keypress', resetTimer);
    clearTimeout(timeout);
  });
};
