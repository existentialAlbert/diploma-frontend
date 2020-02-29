<template>
    <div>
        <template v-if="!editing">
            <label v-if="data != null"> {{data}} </label>
            <label v-else>Заполните это поле</label>
            <button @click="editing = true">Редактировать</button>
        </template>
        <template v-else>
            <form onsubmit="return false;">
                <label>
                    <input v-bind:value="data">
                </label>
            </form>
        </template>
    </div>
</template>

<script>
    export default {
        name: "InfoInput",
        props: ["data", "edit"],
        data() {
            return {
                editing: this.edit,
            }
        },
        methods: {
            submit: function () {
                /*const axios = require('axios').default;
                axios({
                    url:""
                });*/
            }
        }
    }
</script>

<style scoped>
    li {
        margin: auto;
    }
</style>
