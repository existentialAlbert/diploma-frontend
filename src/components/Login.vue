<template>
    <div id="main">
        <div class="error_box" :style="{display: disp}">
            <table>
                <tr>
                    <td>
                        <ul>
                            <li v-for="i of errorRow" v-bind:key="i">
                                {{i}}
                            </li>
                        </ul>
                    </td>
                </tr>
            </table>
        </div>
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
    export default {
        name: 'Registration',
        props: {},
        data() {
            return {
                login: "",
                password: "",
                errorRow: [],
            }
        },
        computed: {
            disp: function () {
                return this.errorRow.length !== 0 ? "yes" : "none";
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
                    if (response.status === 200) {
                        console.log(response.data);
                        localStorage.setItem("token", response.data.token);
                        window.location.replace("/personalcabinet");
                    }
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

    .error_box {
        background: orange;
        margin-left: 25%;
        margin-right: 25%;
    }
</style>
