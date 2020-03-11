import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Login from "@/components/pages/Login";
import UsersPage from "@/components/pages/UsersPage";
import Registration from "@/components/pages/Registration";
import PersonalCabinet from "@/components/pages/PersonalCabinet";
import TasksPage from "@/components/pages/TasksPage";
import Task from "@/components/pages/Task";

Vue.use(VueRouter);
const routes = [
    {path: '/', component: Login},
    {path: '/registration', component: Registration},
    {path: '/users/user/:username', component: PersonalCabinet},
    {path: '/users/page/:page', component: UsersPage},
    {path: '/tasks/page/:page', component: TasksPage},
    {path: '/tasks/task/:task_id', component: Task}
];
const axios = require('axios').default;
const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = "Bearer";
if (token)
    axios.defaults.headers.common['Authorization'] += " " +  token;

axios.defaults.headers.common['Content-Type'] = "application/json";
axios.defaults.baseURL = "https://tierion-jvm-project.herokuapp.com/api/";
const router = new VueRouter({
    routes,
    mode: 'history'
});

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');

