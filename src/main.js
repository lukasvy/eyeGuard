import Vue from "vue";
import App from "./App.vue";

import VueElectron from 'vue-electron'
import Transitions from 'vue2-transitions'

import 'semantic-ui-css/semantic.min.css';

Vue.use(Transitions);
Vue.use(VueElectron);
new Vue(
    {
        render: h => h(App)
    }).$mount("#app");