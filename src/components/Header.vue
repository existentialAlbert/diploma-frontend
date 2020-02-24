<template>
    <div>
        <table>
            <tr>
                <td align="right">
                    <a style="color:white" href="/personalcabinet" v-if="tokenized">Альберт</a>
                    <a href="/registration" v-else>Нет аккаунта? Зарегистрируйтесь!</a>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "Header",
        data: function () {
            return {
                name: undefined,
            }
        },
        computed: {
            tokenized: function () {
                return localStorage.getItem("token");
            }
        },

        methods: {
            beforeUpdate: function () {
            }
        }
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
