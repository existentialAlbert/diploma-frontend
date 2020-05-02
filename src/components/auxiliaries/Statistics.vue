<template>
    <div>
        Верных ответов: {{correctAnswersCount}}
        <br>
        Всего ответов: {{answerCount}}
    </div>
</template>

<script>
    export default {
        name: "Statistics",
        props: ["type",],
        data() {
            return {
                answerCount: 0,
                correctAnswersCount: 0,
            }
        },
        created() {
            const axios = require("axios").default;
            let id;
            if (this.type === 'task')
                id = this.$route.params.task_id;
            else
                id = localStorage.getItem('id');
            axios(`api/task-interactions/${this.type}/stats/${id}`).then(response => {
                this.answerCount = response.data.answerCount;
                this.correctAnswersCount = response.data.correctAnswerCount;
            })
        }
    }
</script>

<style scoped>

</style>
