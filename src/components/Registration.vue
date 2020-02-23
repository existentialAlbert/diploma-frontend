<template>
    <div>
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
                Введите свой никнейм:<br/>
                <input type="text" v-model="login" maxlength="25"/>
                <br/>
                Введите пароль:<br/>
                <input type="password" v-model="password" maxlength="40">
                <br/>
                Введите пароль еще раз:<br/>
                <input type="password" v-model="approvanceOfPassword" maxlength="40">
                <br/>
                <button @click="registration">Создать аккаунт</button>
            </label>
        </form>
        <label>{{password}}</label>
    </div>
</template>
<script>
    export default {
        name: "Registration",
        components: {},
        data: function () {
            return {
                login: "",
                password: "",
                approvanceOfPassword: "",
                errorRow: [],
            }
        },
        computed: {
            correct: function () {
                return this.approvanceOfPassword === this.password;
            },
            disp: function () {
                return this.errorRow.length !== 0? "yes" : "none";
            }
        },
        methods: {
            registration: function () {
                if (this.correct) {
                    const axios = require('axios').default;
                    axios({
                            url: "https://tierion-jvm-project.herokuapp.com/api/users",
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
                        let errors = response.data;
                        switch (response.status) {
                            case 200: {
                                this.errorRow = [];
                                for (let i of errors["errors"])
                                    this.errorRow.push(i.message);
                                break;
                            }
                            case 201: {
                                localStorage.setItem("token", response.data.token);
                                window.location.replace("/progress");
                                break;
                            }
                        }
                    });
                } else
                    this.errorRow.push("Пароли не совпадают!");
            }
        }
    }
</script>

<style scoped>
    * {
        margin: auto;
    }

    div {
        background: white;
    }
    .error_box {
        background: orange;
        margin-left: 25%;
        margin-right: 25%;
    }
</style>
