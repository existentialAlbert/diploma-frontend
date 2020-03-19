<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div class="container-fluid">
                <ul class="navbar-nav" v-if="tokenized">
                    <li>
                        <a @click="$router.back" class="nav-link">
                       <ArrowLeft>
                       </ArrowLeft>
                        Назад
                    </a>
                    </li>
                    <li>
                        <a class="nav-link" href="/users/page/0">Другие пользователи</a>
                    </li>
                    <li>
                        <a class="nav-link" href="/tasks/page/0">Задачи</a>
                    </li>
                    <li v-if="isAdmin">
                        <a class="nav-link" href="/errors/page/0">Ошибки</a>
                    </li>
                </ul>
                <div class="container" v-else>
                    <ul class="navbar-nav ">
                        <li class="nav-item ">
                            <a class="nav-link" href='/'>Войти</a>
                        </li>
                        <li>
                            <a class="nav-link" href="/registration">Зарегистрироваться</a>
                        </li>
                    </ul>
                </div>
                <ul class="navbar-nav" v-if="tokenized">
                    <li class="nav-item">
                        <b-dd class="shadow-sm" v-bind:text="name" right role="button">
                            <b-dropdown-item @click="personalCabinet">Перейти в личный кабинет</b-dropdown-item>
                            <b-dropdown-item @click="exit">Выйти</b-dropdown-item>
                        </b-dd>
                    </li>
                </ul>

            </div>
        </nav>
    </div>
</template>

<script>
    export default {
        name: "Header",
        data() {
            return {
                token: localStorage.getItem("token"),
                name: localStorage.getItem("name"),
                tokenized: localStorage.getItem("token") != undefined,
                isAdmin: localStorage.getItem("status") === "ADMIN",
            }
        },
        watch: {
            $route() {
                this.token = localStorage.getItem("token");
                this.name = localStorage.getItem("name");
                this.tokenized = localStorage.getItem("token") != undefined;
                this.isAdmin = localStorage.getItem("status") === "ADMIN";
            },
        },
        methods: {
            exit: function () {
                this.name = undefined;
                this.token = undefined;
                this.tokenized = false;
                localStorage.removeItem("token");
                localStorage.removeItem("name");
                this.$router.push("/");
            },
            personalCabinet: function () {
                this.$router.push('/users/user/' + localStorage.getItem("name"));
            },
        },
    }
</script>
<style scoped>

</style>
