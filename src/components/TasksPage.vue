<template>
    <div>
        <h1>Задачи</h1>

            <a v-for="(task) in tasksPage" href="" @click="sendToTask(task.id)" v-bind:key="task">
                <label>{{task.index}}: {{task.name}}
                <br/>
                </label>
            </a>


        <Pagination v-bind:amount="pages - 1" url="/tasks/page/"></Pagination>
    </div>
</template>

<script>
    import Pagination from "@/components/Pagination";

    export default {
        name: "TasksPage",
        components: {Pagination},
        data() {
            return {
                tasksPage: [],
                taskTypes: [],
                pages: 0,
            }
        },
        methods: {
            sendToTask(taskId) {
                this.$router.push("/tasks/task/" + taskId)
            }
        },
        created() {
            const axios = require("axios").default;
            axios({
                url: `https://tierion-jvm-project.herokuapp.com/api/tasks/page/${this.$route.params.page}/size/10`,
                method: "GET",
            }).then(response => {
                for (let i in response.data) {
                    let index = response.data[i].id + 10 * Number(this.$route.params.page);
                    this.tasksPage.push({
                        name: response.data[i].name,
                        index: index,
                    });
                    this.taskTypes.push(response.data[i].type);
                }
            })
        },
    }
</script>

<style scoped>

</style>
