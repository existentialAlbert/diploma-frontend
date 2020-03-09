<template>
    <div>
        <h1>Регистрация</h1>
        <ErrorBox v-bind:errors="errorRow"></ErrorBox>
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
    import ErrorBox from "@/components/ErrorBox";

    const axios = require('axios').default;

    export default {
        name: "Registration",
        components: {ErrorBox},
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
        },
        methods: {
            registration: function () {
                if (this.correct) {
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
                    ).then(() => {
                        this.$router.push("/");
                    }).catch((error) => {
                        this.errorRow = [];
                        if (error.response.data.status === undefined)
                            for (let i of error.response.data.errors)
                                this.errorRow.push(i.message);
                        else this.errorRow.push(error.response.data.message);
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
</style>
