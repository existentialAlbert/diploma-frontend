<template>
    <div class="container col-6">
        <br/>
        <h1>Регистрация</h1>
        <br/>
        <ErrorBox v-bind:errors="errorRow"></ErrorBox>
        <form class="form-group" onsubmit="return false;">
            <label>
                Введите свой никнейм:<br/>
                <input class="form-control" type="text" v-model="login" maxlength="25"/>
                Введите пароль:<br/>
                <input class="form-control" type="password" v-model="password" maxlength="40">
                Введите пароль еще раз:<br/>
                <input class="form-control" type="password" v-model="approval" maxlength="40">
                <br/>
                <button class="btn btn-outline-primary" @click="registration">Создать аккаунт</button>
            </label>
        </form>
    </div>
</template>
<script>
    import ErrorBox from "@/components/auxiliaries/ErrorBox";
    const axios = require('axios').default;

    export default {
        name: "Registration",
        components: {ErrorBox},
        data: function () {
            return {
                login: "",
                password: "",
                approval: "",
                errorRow: [],
            }
        },
        computed: {
            correct: function () {
                return this.approval === this.password;
            },
        },
        methods: {
            registration: function () {
                if (this.correct)
                    axios.post("api/users", {
                        "password": this.password,
                        "username": this.login
                    }).then(() =>
                        this.$router.push("/")
                    ).catch((error) => {
                        this.errorRow = [];
                        if (error.response.data.status === undefined)
                            for (let i of error.response.data.errors)
                                this.errorRow.push(i.message);
                        else this.errorRow.push(error.response.data.message);
                    });
                else
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
