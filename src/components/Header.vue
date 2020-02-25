<template>
    <div>
        <table>
            <tr>
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
        padding: -10%;
        text-align: right;
    }
</style>
