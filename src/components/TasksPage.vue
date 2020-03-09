<template>
    <div>
        <h1>Задачи</h1>
            <a v-for="(task) in tasksPage" href="" @click="sendToTask(task.id)" v-bind:key="task">
                <label>{{task.id}}: {{task.name}}
                <br/>
                </label>
            </a>
        <Pagination v-bind:amount="pages - 1" url="/tasks/page/"></Pagination>
        <button @click="solveRandomTask">Решить рандомный таск</button>
        <label v-if="visible">Вы уже решили все таски. Поздравляем!</label>
    </div>
</template>

<script>
    import Pagination from "@/components/Pagination";
    const axios = require("axios").default;
    export default {
        name: "TasksPage",
        components: {Pagination},
        data() {
            return {
                tasksPage: [],
                taskTypes: [],
                pages: 0,
                visible: false,
            }
        },
        methods: {
            sendToTask(taskId) {
                this.$router.push("/tasks/task/" + taskId)
            },
            solveRandomTask(){
                axios({
                    url: "https://tierion-jvm-project.herokuapp.com/api/tasks/unsolved",
                }).then(response => {
                    this.sendToTask(response.data.id);
                }).catch();
            },
        },
        created() {
            axios({
                url: `https://tierion-jvm-project.herokuapp.com/api/tasks/page/${this.$route.params.page}/size/10`,
                method: "GET",
            }).then(response => {
                for (let i in response.data) {
                    this.tasksPage.push({
                        name: response.data[i].name,
                        id: response.data[i].id,
                    });
                    this.taskTypes.push(response.data[i].type);
                }
            })
        },
    }
</script>

<style scoped>

</style>
