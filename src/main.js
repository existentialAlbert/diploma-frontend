import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Intro from "@/components/Intro";
Vue.use(VueRouter);

const routes = [
  { path: '/', component: Login },
  { path: '/Intro', component: Intro},
    ];

const router = new VueRouter({
  routes // short for `routes: routes`
});
new Vue({
  render: h => h(App),
  router
}).$mount('#app');

