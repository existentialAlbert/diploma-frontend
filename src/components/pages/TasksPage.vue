<template>
    <div>
        <h1>Задачи</h1>
        <div v-for="(tasksGroup, value) in tasksPage" v-bind:key="tasksGroup">
            <h3>{{value}}</h3>
            <a v-for="(task) in tasksGroup" href="" @click="sendToTask(task.id)" v-bind:key="task">
                <label>{{task.id}}: {{task.name}}
                    <br/>
                </label>
            </a>
        </div>
        <Pagination v-bind:amount="pages - 1" url="/tasks/page/"></Pagination>
        <button @click="solveRandomTask">Решить рандомный таск</button>
        <label v-if="visible">Вы уже решили все таски. Поздравляем!</label>
    </div>
</template>

<script>
    import Pagination from "@/components/auxiliaries/Pagination";

    const axios = require("axios").default;
    export default {
        name: "TasksPage",
        components: {Pagination},
        data() {
            return {
                tasksPage: {},
                pages: 0,
                visible: false,
            }
        },
        methods: {
            sendToTask(taskId) {
                this.$router.push("/tasks/task/" + taskId)
            },
            solveRandomTask() {
                axios("tasks/unsolved").then(response => {
                    this.sendToTask(response.data.id);
                }).catch(error => {
                    if (error.data.status == 400)
                        this.visible = true;
                });
            },
        },
        created() {
            axios(`tasks/page/${this.$route.params.page}/size/10`).then(response => {
                let types = {};
                for (let i in response.data) {
                    if (types[response.data[i].type.caption] === undefined)
                        types[response.data[i].type.caption] = [];
                    types[response.data[i].type.caption].push(response.data[i]);
                    console.log(types[response.data[i].type.caption] + " " + response.data[i].type.caption);
                }
                this.tasksPage = types;
            })
        },
    }
</script>

<style scoped>

</style>
