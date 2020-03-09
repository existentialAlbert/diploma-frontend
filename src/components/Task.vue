<template>
    <div>
        <h1>{{taskInfo.name}}</h1>
        <article>
            <h2>Задание</h2>
            <label v-for="i in taskInfo.text_array" v-bind:key="i">
                {{i}}
                <br/>
            </label>
            {{taskInfo.correctAnswer}}
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
            <button v-if="!checked && !isEmpty">Проверить</button>
            <template v-if="checked">
                <Statistics v-bind:id="this.$route.params.task_id" type="task"></Statistics>
                <article>
                    <h2>Пояснение</h2>
                    {{answerExplaination}}
                </article>
            </template>
        </form>
    </div>
</template>

<script>
    import Statistics from "@/components/Statistics";
    const axios = require('axios').default;
    export default {
        name: "Task",
        components: {Statistics},
        data: function () {
            return {
                taskInfo: {},
                userAnswer: "",
                colour: "",
                checked: false,
                statistics: "",
                answerExplaination: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
            }
        },
        computed: {
            isEmpty() {
                return this.userAnswer.length === 0;
            }
        },
        methods: {
            check() {
                this.colour = this.userAnswer === this.taskInfo.correctAnswer ? "2px solid lime" : "2px solid red";
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
                }).then(() => {
                    this.checked = true;
                    this.getStatistics();
                });
                return false;
            },
        },
        created() {
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
                this.colour = this.userAnswer === this.taskInfo.correctAnswer ? "2px solid lime" : "2px solid red";
                this.checked = true;
                this.getStatistics();
            }).catch();
        },
    }
</script>

<style scoped>
    article {
        text-align: left;
        padding-left: 25%;
        padding-right: 25%;
    }
</style>
