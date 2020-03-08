<template>
    <div>
        <h1>Название таска</h1>
        <article style="text-align: left; padding-left: 25%">
            <h2>Задание</h2>
            <label v-for="i in taskInfo.text_array" v-bind:key="i">
                {{i}}
                <br/>
            </label>
        </article>
        <form onsubmit="return false" @submit="check">
            <table align="center">
                <tr>
                    <td v-bind:style="{}">
                        <label>Ваш ответ:<br/>
                            <textarea cols="100" rows="15" v-model="userAnswer"
                                      style="width:560px;" v-bind:style="{border: colour}"> </textarea>
                        </label>
                    </td>
                </tr>
            </table>
            <button v-if="checked">Проверить</button>
        </form>
        {{userAnswer}}
    </div>
</template>

<script>
    export default {
        name: "Task",
        data: function () {
            return {
                taskInfo: {},
                userAnswer: "",
                colour: "",
                checked: false,
            }
        },
        methods: {
            check() {
                this.colour = this.userAnswer === this.taskInfo.correctAnswer ? "green" : "red";
                const axios = require('axios').default;
                axios({
                    url: `https://tierion-jvm-project.herokuapp.com/api/task-interactions/`,
                    method: "POST",
                    data: {
                        "answer": this.userAnswer,
                        "taskId": String(this.$route.params.task_id),
                    },
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json"
                    }
                }).then(() => this.checked = true);
                return false;
            },
        },
        created() {
            const axios = require('axios').default;
            axios({
                url: `https://tierion-jvm-project.herokuapp.com/api/tasks/${this.$route.params.task_id}`,
                method: "GET",
            }).then(response => {
                this.taskInfo = response.data;
                this.taskInfo.text_array = response.data.text.split("\n");
            });
            axios({
                url: `https://tierion-jvm-project.herokuapp.com/api/task-interactions/task/${this.$route.params.task_id}`,
                method: "GET",
            }).then(response => {
                    this.userAnswer = response.data.userAnswer;
                    this.taskInfo.correctAnswer = response.data.correctAnswer;
                    this.colour = "2px solid " + this.userAnswer === this.taskInfo.correctAnswer ? "lime" : "red";
                    this.checked = true;
                }
            ).catch();
        },
    }
</script>

<style scoped>
</style>
