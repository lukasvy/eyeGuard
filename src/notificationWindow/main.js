import Vue from "vue";
import App from "./Notification.vue";

import VueElectron from 'vue-electron'
import Transitions from 'vue2-transitions';


Vue.use(Transitions);
Vue.use(VueElectron);
new Vue(
    {
        render: h => h(App)
    }).$mount("#app");