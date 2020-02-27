<template>
    <div>
        <ul v-for="(name, index) in names" v-bind:key="name">
            <li v-if="editing">
                <form onsubmit="return false;">
                    <label>
                        <input v-bind:value="i">
                    </label>
                </form>
            </li>
            <template v-else>
                <li v-if="true">{{name}}: {{data[index+1]}}<button @click="editing = true">Редактировать</button></li>
                <li v-else> Заполните это поле! <button @click="editing = true">Редактировать</button></li>
            </template>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "InfoInput",
        props: ["data", "names"],
        data() {
            return {
                editing: false,
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
    margin : auto;
}
</style>
