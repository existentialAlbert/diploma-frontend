<template>
    <div>
        <h1>Исключение <br/>{{info.exceptionName}}</h1>
        <h2>Сообщение:</h2>
        <article>{{info.message}}</article>
        <h2>Время:</h2>
        <article>{{info.throwDate}}</article>
        <h2>Stack trace:</h2>
        <pre>
        {{info.stackTrace}}
        </pre>
        <button @click="solve">
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
                axios.put(`errors/${this.$route.code}`).then(() => this.$router.push("/errors/page/0"));
            }
        },
        created() {
            axios(`errors/${this.$route.params.code}`).then(response => {
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
