<template>
    <div v-if="isActive">
        <table>
            <tr>
                <td>
                    <ul>
                        <li v-for="i of errors" v-bind:key="i">
                            {{i}}
                        </li>
                    </ul>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "ErrorBox",
        props: ["errors", "isActive"]

    }
</script>

<style scoped>
    div {
        background: orange;
        margin-left: 25%;
        margin-right: 25%;
        color: #e44f00;
    }
</style>
