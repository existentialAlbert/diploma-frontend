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
            return{
            }
        },
        computed: {
            tokenized: function () {
                return localStorage.getItem("token");
            },
            name: function () {
              return localStorage.getItem("name");
            }
        },

        methods: {

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
