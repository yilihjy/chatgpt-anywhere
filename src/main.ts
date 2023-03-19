import { createApp } from 'vue';
import App from './App.vue';
import Chat from 'vue3-beautiful-chat';
import 'highlight.js/styles/default.css';
import 'github-fork-ribbon-css/gh-fork-ribbon.css';
createApp(App).use(Chat).mount('#app');
