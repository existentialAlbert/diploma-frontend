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
        props: ["type", 'identificator'],
        data() {
            return {
                answerCount: "",
                correctAnswersCount: "",
            }
        },
        methods:{
          async getInfo(){
              const axios = require("axios").default;
              let id;
              if (this.type === 'task')
                  id = this.$route.params.task_id;
              else if (this.type === 'user')
                  await axios(`/api/users/username/${this.$route.params.username}`).then(
                      response => {
                          id = response.data.id;
                      }
                  );
              axios(`api/task-interactions/${this.type}/stats/${id}`).then(response => {
                  this.answerCount = response.data.answerCount;
                  this.correctAnswersCount = response.data.correctAnswerCount;
              })
          }
        },
        watch: {
            $route() {
                this.getInfo();
            }
        },
        created(){
            this.getInfo();
        }
    }
</script>

<style scoped>

</style>
