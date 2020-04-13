<template>
    <div>
        <h1>{{taskInfo.name}}</h1>
        <article>
            <h2>Задание</h2>
            {{text.description}}
            <br/>
            <pre v-html="text.code">
            </pre>
        </article>
        <form onsubmit="return false" @submit="check">
            <label>Ваш ответ:<br/>
                <textarea class="form-control" cols="50" rows="15" v-model="userAnswer"
                          style="width:560px;" :style="{border: colour}"> </textarea>
            </label>
            <button v-if="!checked && !isEmpty">Проверить</button>
            <template v-if="checked">
                <Statistics :id="this.$route.params.task_id" type="task"></Statistics>
                <article>
                    <h2>Пояснение</h2>
                    {{text.explanation}}
                </article>
            </template>
        </form>
    </div>
</template>

<script>
    import Statistics from "@/components/auxiliaries/Statistics";

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
                text: {},
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
                axios.post(`api/task-interactions`, {
                    "answer": this.userAnswer,
                    "taskId": String(this.$route.params.task_id),
                }).then(() => this.checked = true);
                return false;
            },
        },
        created() {
            axios(`api/tasks/${this.$route.params.task_id}`).then(response => {
                this.taskInfo = response.data;
                let arr = response.data.text.split("<code>");
                this.text.description = arr[0];
                this.text.code = "<code>\n" + arr[1];
                this.text.explanation = response.data.explanation;
                console.log(this.text.code);

            });
            axios(`api/task-interactions/task/${this.$route.params.task_id}`).then(response => {
                this.userAnswer = response.data.userAnswer;
                this.taskInfo.correctAnswer = response.data.correctAnswer;
                this.colour = this.userAnswer === this.taskInfo.correctAnswer ? "2px solid lime" : "2px solid red";
                this.checked = true;
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
