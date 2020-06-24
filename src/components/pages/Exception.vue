<template>
    <div>
        <h2>Исключение</h2>
        {{info.exceptionName}}
        <h3>Сообщение:</h3>
        <article>{{info.message}}</article>
        <h3>Время:</h3>
        <article>{{info.throwDate}}</article>
        <h3>Stack trace:</h3>
        <pre>
        {{info.stackTrace}}
        </pre>
        <button class="btn btn-outline-success" @click="solve">
            Решено
        </button>
    </div>
</template>

<script>
    const axios = require('axios').default;
    export default {
        name: "Exception",
        data() {
            return {
                info: {},
            }
        },
        methods: {
            solve() {
                axios.put(`api/errors/${this.$route.params.code}`).then(() => this.$router.push("/errors/page/0"));
            }
        },
        created() {
            axios(`api/errors/${this.$route.params.code}`).then(response => {
                this.info = response.data;
            })
        },
    }
</script>

<style scoped>
    pre {
        text-align: left;
        padding-left: 25%;
        padding-right: 25%;
    }
</style>
