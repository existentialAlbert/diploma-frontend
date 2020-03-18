<template>
    <div id="main">
        <ErrorBox v-bind:errors="errorRow"></ErrorBox>
        <br>
        <h1>Вход в систему</h1>
        <div class="container col-4">
        <form class="form-control" onsubmit="return false;">
            <label>
                Имя пользователя
                <br>
                <input class="form-control" type="text" maxlength="25" v-model="login">
            </label>
            <br>
            <label>
                Пароль
                <br>
                <input class="form-control" type="password" maxlength="40" v-model="password">
            </label>
            <br>
            <button class="btn btn-outline-primary" @click="logIn">Войти</button>
            <br/>
        </form>
        </div>
    </div>
</template>

<script>
    import ErrorBox from "@/components/auxiliaries/ErrorBox";

    export default {
        name: 'Registration',
        components: {ErrorBox},
        props: {},
        data() {
            return {
                login: "",
                password: "",
                errorRow: [],
            }
        },
        methods: {
            logIn: function () {
                const axios = require('axios').default;
                axios.post("auth/login", {
                    "password": this.password,
                    "username": this.login
                }).then((response) => {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("name", this.login);
                    this.$router.push({path: `/users/user/${this.login}`});
                }).catch((error) => {
                    this.errorRow = [];
                    if (error.response.data.status === undefined)
                        for (let i of error.response.data.errors)
                            this.errorRow.push(i.message);
                    else this.errorRow.push(error.response.data.message);
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
