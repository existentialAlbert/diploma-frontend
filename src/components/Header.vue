<template>
    <div>
        <table>
            <tr>
                <td v-if="tokenized">
                    <a href="/users/page/0">Посмотреть других юзеров</a>
                    <a href="/tasks/page/0">Перейти к задачам</a>
                    <button style='color:white' @click="personalCabinet">{{name}}</button>
                    <a href='/' @click='exit'>Выйти</a>
                </td>
                <td v-else>
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
            personalCabinet: function () {
                this.$router.push('/users/user/' + localStorage.getItem("name"));
            },
            users: function () {
                this.$router.push('/users/page/0')
            }
        },
    }
</script>

<style scoped>
    div {
        background: gray    ;
        padding-top: 1%;
        text-align: right;
    }

    td {
        alignment: right;
    }
</style>
