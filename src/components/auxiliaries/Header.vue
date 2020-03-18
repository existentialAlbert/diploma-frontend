<template>
    <div>
        {{token}}
        <nav class="navbar">
            <div class="container-fluid">
                <ul class="nav navbar-nav" v-if="tokenized">
                    <li class="active">
                        <a href="/users/page/0">Посмотреть других юзеров</a>
                    </li>
                    <li class="active">
                        <a href="/tasks/page/0">Перейти к задачам</a>
                    </li>
                    <li class="active">
                        <a href="" @click="personalCabinet">{{name}}</a>
                    </li>
                    <li class="active">
                        <a href="" @click="$router.go(-1)">Назад</a>
                    </li>
                    <li class="active">
                        <a href='/' @click='exit'>Выйти</a>
                    </li>
                    <li v-if="isAdmin">
                        <a href="/errors/page/0">Ошибки</a>
                    </li>
                </ul>
                <ul v-else>
                    <li class="active">
                        <a href='/'>Войти</a>
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
                isAdmin: localStorage.getItem("status"),
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
                this.$router.push("/", () => {
                    this.name = undefined;
                    this.token = undefined;
                    this.tokenized = false;
                    localStorage.removeItem("token");
                    localStorage.removeItem("name");
                });
            },
            personalCabinet: function () {
                this.$router.push('/users/user/' + localStorage.getItem("name"));
            },
        },
    }
</script>
<style scoped>
    div {
        background-color: grey;
    }
</style>
