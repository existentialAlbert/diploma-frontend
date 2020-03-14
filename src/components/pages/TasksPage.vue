<template>
    <div>
        <h1>Задачи</h1>
        <div v-for="(tasksGroup, value) in page" v-bind:key="tasksGroup">
            <h3>{{value}}</h3>
            <a v-for="(task) in tasksGroup" href="" @click="sendToTask(task.id)" v-bind:key="task">
                <label>{{task.id}}: {{task.name}}
                    <br/>
                </label>
            </a>
        </div>
        <Pagination v-bind:amount="pages - 1" url="/tasks/page/"></Pagination>
        <button @click="solveRandomTask">Решить рандомный таск</button>
        <label v-if="visible">Вы уже решили все таски!</label>
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
                page: {},
                pages: 0,
                visible: false,
            }
        },
        methods: {
            sendToTask(taskId) {
                this.$router.push("/tasks/task/" + taskId);
            },
            solveRandomTask() {
                axios("tasks/unsolved").then(response => this.sendToTask(response.data.id)).catch(error => {
                    if (error.data.status == 400)
                        this.visible = true;
                });
            },
        },
        created() {
            axios(`tasks/page/${this.$route.params.page}/size/10`).then(response => {
                let types = {};
                for (let i in response.data) {
                    let type = response.data[i].type.caption;
                    if (types[type] === undefined)
                        types[type] = [];
                    types[type].push(response.data[i]);
                }
                this.page = types;
            })
        },
    }
</script>

<style scoped>

</style>
