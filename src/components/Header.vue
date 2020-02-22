<template>
    <div>
        <table>
            <tr>
                <td>
                    <label>2</label>
                </td>
                <td>
                    <a href="/personal-cab" v-if="false">Личный кабинет</a>
                    <a href="/registration" v-else>Нет аккаунта? Зарегистрируйтесь!</a>
                </td>

            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "Header"
    }
</script>

<style scoped>
    div {
        background: violet;
        padding: -10%;
        text-align: right;
    }
</style>
