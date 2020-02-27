<template>
    <div>
        <table>
            <tr>
                <td v-bind:style="{display: authorized}">
                    <a style='color:white' href='' @click='this.$router.push("/user/{{name}}")'>{{name}}</a>
                    <a href='/' @click='exit'>Выйти</a>
                </td>
                <td v-bind:style="{display: unauthorized}">
                    <a href='/'>Войти</a>
                </td>
            </tr>
        </table>
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
            }
        },
        computed: {
            authorized: function () {
                return this.tokenized ? "" : "none"
            },
            unauthorized: function () {
                return this.tokenized ? "none" : "";
            },
        },
        watch: {
            $route() {
                this.token = localStorage.getItem("token");
                this.name = localStorage.getItem("name");
                this.tokenized = localStorage.getItem("token") != undefined;
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
        },
    }
</script>

<style scoped>
    div {
        background: violet;
        padding-top: 1%;
        text-align: right;
    }

    td {
        alignment: right;
    }
</style>
