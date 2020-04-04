import Vue from 'vue'

import {BootstrapVue, IconsPlugin, BootstrapVueIcons} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import {BIconPerson, BIconChevronLeft, BIconArrowLeft, BIconLockFill } from 'bootstrap-vue'


import App from './App.vue'

import VueRouter from 'vue-router'

import Login from "@/components/pages/Login";
import UsersPage from "@/components/pages/UsersPage";
import Registration from "@/components/pages/Registration";
import PersonalCabinet from "@/components/pages/PersonalCabinet";
import TasksPage from "@/components/pages/task_related/TasksPage";
import Task from "@/components/pages/task_related/Task";
import ExceptionsPage from "@/components/pages/ExceptionsPage";
import Exception from "@/components/pages/Exception";
import TaskGenerator from "@/components/pages/task_related/TaskGenerator";
import Test from "@/components/pages/task_related/Test";

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(BootstrapVueIcons);
Vue.component('Person', BIconPerson);
Vue.component('ArrowLeft', BIconArrowLeft);
Vue.component('LockFill', BIconLockFill);
Vue.component('ChevronLeft', BIconChevronLeft);

const routes = [
    {path: '/', component: Login},
    {path: '/registration', component: Registration},
    {path: '/users/user/:username', component: PersonalCabinet},
    {path: '/users/page/:page', component: UsersPage},
    {path: '/tasks/page/:page', component: TasksPage},
    {path: '/tasks/task/:task_id', component: Task},
    {path: '/tasks/generate', component: TaskGenerator},
    {path: '/errors/page/:page', component: ExceptionsPage},
    {path: '/errors/error/:code', component: Exception},
    {path: '/test', component: Test}
];
const axios = require('axios').default;
const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = "Bearer";
if (token)
    axios.defaults.headers.common['Authorization'] += " " + token;
axios.defaults.headers.common['Content-Type'] = "application/json";
axios.defaults.baseURL = "https://tierion-jvm-project.herokuapp.com/";
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.data.status === 403 && window.location.pathname !== "/") {
        console.log(window.location.href);
       window.location.replace("/");
    }
    if (error.response.data.status === 500 && error.response.data.startsWith("<!doctype html>"))
        axios.post("api/auth/refresh").then(response => {
           localStorage.setItem("token", response.data["token"]);
        });
    return Promise.reject(error);
});
const router = new VueRouter({
    routes,
    mode: 'history'
});

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');

