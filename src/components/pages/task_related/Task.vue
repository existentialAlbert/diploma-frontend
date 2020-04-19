<template>
    <div>
        <br>
        <h1>{{taskInfo.name}}</h1>
        <article>
            <br/>
            <h2>Задание</h2>
            {{text.description}}
            <br/>
            <prism class="form-group rounded border shadow-sm" language="javascript">
                {{text.code}}
            </prism>
        </article>
        <form class="form-group rounded" onsubmit="return false" @submit="check">
            <br/>
            <label>Ваш ответ:<br/>
                <textarea class="form-control shadow-sm rounded" cols="50" rows="15" @input="t = 1" v-model="userAnswer"
                          style="width:560px;" :style="{border: colour}"> </textarea>
            </label>
            <br>
            <span :class="t===1?'button':''">
            <button v-if="t === 1" class="btn btn-primary">Проверить</button>
            </span>
            <template v-if="checked">
                <Statistics :id="this.$route.params.task_id" type="task"></Statistics>
                <article>
                    <h2>Пояснение</h2>
                    {{text.explanation}}
                </article>
            </template>
            <br>
            <br>
        </form>
    </div>
</template>

<script>
    import Statistics from "@/components/auxiliaries/Statistics";
    import Prism from 'vue-prism-component';

    const axios = require('axios').default;
    export default {
        name: "Task",
        components: {Statistics, Prism},
        data: function () {
            return {
                taskInfo: {},
                userAnswer: "",
                colour: "",
                checked: false,
                text: {},
                t: 0
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
                this.text.code = arr[1].replace('</code>', ''); //"<code>\n" + arr[1];

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
    @keyframes disappear {
        from {
            opacity: 100%;
        }
        to{
            opacity: 0;
        }
    }
    @keyframes appear {
        from{
            opacity: 0;
        }
        to{
            opacity: 100%;
        }
    }
    .button{
        animation: appear 0.5s 1 ease-in;
    }
    .dbutton{
        animation: disappear 0.5s 1 ease-in;
    }
</style>
