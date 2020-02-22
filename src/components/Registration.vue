<template>
    <div>
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
            }
        },
        methods: {
            registration: function () {
                let req = new XMLHttpRequest();
                req.open("POST", "https://tierion-jvm-project.herokuapp.com/api/auth/login");
                req.setRequestHeader('Authorization', 'Bearer');
                req.setRequestHeader("Content-Type", 'application/json');
                req.setRequestHeader('Access-Control-Allow-Origin', "*");
                req.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With');
                req.send(JSON.stringify({"password": this.password, "username": this.login}));
                req.onload = () => {

                }
            }
        }
    }
</script>

<style scoped>
    * {
        margin: auto;
    }
</style>
