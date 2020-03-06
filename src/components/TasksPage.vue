<template>
    <div>
        <a v-for="(i, index) in tasksPage" href="" @click="sendToTask(index)" v-bind:key="i">
            {{i}}
            <br/>
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
                    let index = 1 + Number(i) + 10 * Number(this.$route.params.page);
                    this.tasksPage.push(index + ". " + response.data[i].name.substr())
                }
            })
        },
    }
</script>

<style scoped>

</style>
