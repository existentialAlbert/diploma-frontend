<template>
    <div>
        <table>
            <tr>
                <td>
                    <label>2</label>
                </td>
                <td>
                    <a href="/personal-cab" v-if="false">{{name}}</a>
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
                const axios = require('axios').default;
                axios({
                    
                }).then();
                localStorage.getItem("token") !== undefined
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
