<template>
    <div id="main">
        <ErrorBox v-bind:errors="errorRow"></ErrorBox>
        <br>
        <h1>Вход в систему</h1>
        <br>
        <div class="container col-4 ">
            <form style="padding-bottom: 2%; padding-top: 2%" class="form-group rounded border shadow-sm" @submit="logIn" onsubmit="return false;">
                <label>
                    Имя пользователя
                    <Person></Person>
                    <input class="form-control shadow-sm" type="text" maxlength="25" v-model="login">
                </label>
                <br>
                <label>
                    Пароль
                    <LockFill></LockFill>
                    <input class="form-control shadow-sm" type="password" maxlength="40" v-model="password">
                </label>
                <br>
                <button class="btn btn-outline-primary">Войти</button>
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
                return false;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
