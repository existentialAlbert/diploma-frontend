import Vue from 'vue'

import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import App from './App.vue'

import VueRouter from 'vue-router'

import Login from "@/components/pages/Login";
import UsersPage from "@/components/pages/UsersPage";
import Registration from "@/components/pages/Registration";
import PersonalCabinet from "@/components/pages/PersonalCabinet";
import TasksPage from "@/components/pages/TasksPage";
import Task from "@/components/pages/Task";
import ExceptionsPage from "@/components/pages/ExceptionsPage";
import Exception from "@/components/pages/Exception";

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
const routes = [
    {path: '/', component: Login},
    {path: '/registration', component: Registration},
    {path: '/users/user/:username', component: PersonalCabinet},
    {path: '/users/page/:page', component: UsersPage},
    {path: '/tasks/page/:page', component: TasksPage},
    {path: '/tasks/task/:task_id', component: Task},
    {path: '/errors/page/:page', component: ExceptionsPage},
    {path: '/errors/error/:code', component: Exception}
];
const axios = require('axios').default;
const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = "Bearer";
if (token)
    axios.defaults.headers.common['Authorization'] += " " + token;
axios.defaults.headers.common['Content-Type'] = "application/json";
axios.defaults.baseURL = "https://tierion-jvm-project.herokuapp.com/api/";
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.data.status === 403)
        window.location.replace("/");
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

