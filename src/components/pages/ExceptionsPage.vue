<template>
    <div>
        <h1>
        </h1>
        <div v-for="exception in page" v-bind:key="exception">
            <a href="" @click="sendToException(exception.id)">
                <strong>{{exception.exceptionName}}</strong>:{{exception.throwDate}}
            </a>
            {{exception.message}}
        </div>
    </div>
</template>

<script>
    let axios = require("axios").default;
    export default {
        name: "Exceptions",
        data() {
            return {
                page: []
            }
        },
        methods: {
            sendToException(id) {
                this.$router.push(`/errors/error/${id}`);
            },
        },
        created() {
            axios("errors/unsolved").then(response => {
                this.page = response.data;
            });
        },
    }
</script>

<style scoped>

</style>
