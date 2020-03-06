<template>
    <div>
        <h1>Название таска</h1>
        <article style="text-align: left; padding-left: 25%">
            Описание таска
        </article>
        <form>
            <label>
                <textarea cols="100" rows="30" v-model="userAnswer" style="width:560px"> </textarea>
            </label>
        </form>
        {{userAnswer}}
    </div>
</template>

<script>
    export default {
        name: "Task",
        data: function () {
            return {
                taskInfo: [],
                userAnswer: "",

            }
        },
        methods: {
            check() {

            },
        },
        created() {
            const axios = require('axios').default;
            axios({
                url: ""
            }).then(response => {
                response;
            });
        },
    }
</script>

<style scoped>

</style>
