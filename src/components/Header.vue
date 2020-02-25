<template>
    <div>
        <table>
            <tr>
<<<<<<< HEAD
                <td>
                    <label>

                        <select>
                            <option>

                            </option>
                        </select>
                    </label>
                </td>
                <td>
                    <a style="color:white" href="/personalcabinet" v-if="tokenized">{{name}}</a>
                    <a href="/" v-else>Войдите</a>
=======
                <td align="right">
                    <a style="color:white" href="/personalcabinet" v-if="tokenized">Альберт</a>
                    <a href="/registration" v-else>Нет аккаунта? Зарегистрируйтесь!</a>
>>>>>>> master
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
                name: "Albert",
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
        },
        computed:{
          tokenized: function () {
              return localStorage.getItem('token');
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
