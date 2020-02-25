import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Intro from "@/components/Intro";
import Registration from "@/components/Registration";
import PersonalCabinet from "@/components/PersonalCabinet";

Vue.use(VueRouter);

const routes = [
    {path: '/', component: Login},
    {path: 'intro', component: Intro},
    {path: '/registration', component: Registration},
    {path: '/personalcabinet', component: PersonalCabinet}
];
const axios = require('axios').default;
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = token;
}
const router = new VueRouter({
    routes,
    mode: 'history'
});
new Vue({
    render: h => h(App),
    router
}).$mount('#app');

