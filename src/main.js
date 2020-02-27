import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import UsersPage from "@/components/UsersPage";
import Registration from "@/components/Registration";
import PersonalCabinet from "@/components/PersonalCabinet/PersonalCabinet";

Vue.use(VueRouter);

const routes = [
    {path: '/', component: Login},
    {path: '/user', component: UsersPage},
    {path: '/registration', component: Registration},
    {path: '/user/:username', component: PersonalCabinet},
];
const axios = require('axios').default;
const token = localStorage.getItem('token');
if (token)
    axios.defaults.headers.common['Authorization'] = "Bearer " + token;
const router = new VueRouter({
    routes,
    mode: 'history'
});

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');

