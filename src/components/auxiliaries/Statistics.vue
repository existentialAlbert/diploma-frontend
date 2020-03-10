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
        props: ["type"],
        data() {
            return {
                answerCount: 0,
                correctAnswersCount: 0,
            }
        },
        created() {
            const axios = require("axios").default;
            axios({
                url: `https://tierion-jvm-project.herokuapp.com/api/task-interactions/${this.type}/stats/` + localStorage.getItem("id"),
            }).then(response =>{
                this.answerCount = response.data.answerCount;
                this.correctAnswersCount = response.data.correctAnswerCount;
            })
        }
    }
</script>

<style scoped>

</style>
