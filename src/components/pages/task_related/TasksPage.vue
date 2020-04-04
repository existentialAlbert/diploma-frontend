<template>
    <div class="container">
        <h1>Задачи</h1>
        <div v-for="(tasksGroup, value) in page" v-bind:key="tasksGroup">
            <h4>{{value}}</h4>
            <a v-for="(task) in tasksGroup" href="" @click="sendToTask(task.id)" v-bind:key="task">
                {{task.id}}: {{task.name}}
                <br/>
            </a>
        </div>
        <Pagination :amount="pages - 1" url="/tasks/page/"></Pagination>
        <button class="btn btn-outline-secondary" @click="solveRandomTask">Решить рандомный таск</button>
        <label v-if="visible">Вы уже решили все таски!</label>
        <a class="nav-link" href="/tasks/generate">Добавить задачу</a>

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
                visible: false,
                tasks: 8,
                tasksOnOnePage: 2,
            }
        },
        computed: {
            pages() {
                return Math.ceil(this.tasks / this.tasksOnOnePage);
            }
        },
        methods: {
            sendToTask(taskId) {
                this.$router.push("/tasks/task/" + taskId);
            },
            solveRandomTask() {
                axios("api/tasks/unsolved").then(response => this.sendToTask(response.data.id)).catch(error => {
                    if (error.data.status == 400)
                        this.visible = true;
                });
            },
            refresh(callback) {
                axios(`api/tasks/page/${this.$route.params.page}/size/${this.tasksOnOnePage}`).then(response => {
                    let types = {};
                    for (let i in response.data) {
                        let type = response.data[i].type.caption;
                        if (types[type] === undefined)
                            types[type] = [];
                        types[type].push(response.data[i]);
                    }
                    this.page = types;
                    callback();
                });
            }
        },
        beforeRouteUpdate(to, from, next) {
            this.refresh(next());
        },
        created() {
            this.refresh();
        },
    }
</script>

<style scoped>

</style>
