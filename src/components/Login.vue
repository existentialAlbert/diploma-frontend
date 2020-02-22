<template>
    <div id="main">
        <form>
            <label>
                Username
                <input type="text" maxlength="25" :value="login">
            </label>
            <br>
            <label>
                Password
                <input type="password" maxlength="40" :value="password">
            </label>
            <button @click="logIn">Go learning!</button>
        </form>
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
            }
        },
        methods:{
            logIn: function () {
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
