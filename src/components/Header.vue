<template>
    <div>
        <table>
            <tr>
                <td>
                    <label>2</label>
                </td>
                <td>
                    <a style="color:white" href="/personalcabinet" v-if="localStorage.getItem('token')">{{name}}</a>
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
        methods: {
            beforeUpdate: function () {
            }
        }
    }
</script>

<style scoped>
    div {
        background: violet;
        padding: -10%;
        text-align: right;
    }
</style>
