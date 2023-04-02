import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store, { key } from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMessage, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faBars, faRightFromBracket, faSpinner } from '@fortawesome/free-solid-svg-icons';
import 'normalize.css';

library.add(faMessage, faPaperPlane, faBars, faRightFromBracket, faSpinner);

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(store, key)
  .use(router)
  .mount('#app');
