<template>
    <div id="main">
        <ErrorBox v-bind:errors="errorRow"></ErrorBox>
        <form onsubmit="return false;">
            <label>
                Юзернейм
                <input type="text" maxlength="25" v-model="login">
            </label>
            <br>
            <label>
                Пароль
                <input type="password" maxlength="40" v-model="password">
            </label>
            <button @click="logIn">Начать учиться</button>
        </form>
        <a href="/registration">Нет аккаунта? Зарегистрируйтесь!</a>
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
                axios({
                        url: "https://tierion-jvm-project.herokuapp.com/api/auth/login",
                        method: "POST",
                        data: {
                            "password": this.password,
                            "username": this.login
                        },
                        headers: {
                            'Authorization': 'Bearer',
                            "Content-Type": 'application/json',
                            'Accept': 'application/json',
                            'Access-Control-Allow-Origin': "*",
                            'Access-Control-Allow-Headers': 'X-Requested-With',
                        }
                    }
                ).then((response) => {
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
    * {
        margin: auto;
    }

    img {
        width: 50%;
        padding-top: 0;
        padding-left: 0;
        padding-bottom: 2%;
    }

    #main {
        padding-top: 0%;
    }

    form {
        margin: auto;
        align-self: center;
        padding-right: 8%;
        padding-left: 8%;
        /*
                background: aqua;
        */
        width: 10%;
    }

    a {
        color: #42b983;
    }


</style>
