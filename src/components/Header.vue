<template>
    <div v-bind:style="{display: tokenized}">
        <table>
            <tr>
                <td>
                    <div>
                        <a style='color:white' href='' @click='this.$router.push("/user/{{name}}")'>{{name}}</a>
                        <a href='' @click='exit'>Выйти</a>
                    </div>
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
                tokenized: this.token !== undefined ? "" : "none",
            }
        },
        watch: {
            $route() {
                this.token = localStorage.getItem("token");
                this.name = localStorage.getItem("name");
                this.tokenized = this.token !== undefined ? "" : "none";
            }
        },
        methods: {
            exit: function () {
                this.$router.push("/").then(() => {
                    this.tokenized = "none";
                    this.name = undefined;
                    this.token = undefined;
                    localStorage.setItem("token", undefined);
                    localStorage.setItem("name", undefined);
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
