import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Intro from "@/components/Intro";
import Registration from "@/components/Registration";

Vue.use(VueRouter);

const routes = [
    {path: '/', component: Login},
    {path: '/intro', component: Intro},
    {path: '/registration', component: Registration}
];

const router = new VueRouter({
    routes
});
new Vue({
    render: h => h(App),
    router
}).$mount('#app');

