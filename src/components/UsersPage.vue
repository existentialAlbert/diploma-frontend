<template>
    <div>
        <a v-for="i in usersPage" href="" @click="sendToUser(i)" v-bind:key="i">
            {{i}}
            <br/>
        </a>
        <Pagination size="1" v-bind:amount="10" url="/users/page/"></Pagination>
    </div>
</template>

<script>
    import Pagination from "@/components/Pagination";

    export default {
        name: "UsersPage",
        components: {Pagination},
        data: function () {
            return {
                pageNumber: this.$route.params.page,
                pages: 1,
                usersPage: [],
            }
        },
        methods: {
            sendToUser(i) {
                this.$router.push('/users/user/' + i);
            },
            refresh() {
                const axios = require('axios').default;
                axios({
                    url: `https://tierion-jvm-project.herokuapp.com/api/users/page/${this.$route.params.page}/size/2`,
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                    }
                }).then(response => {
                    this.usersPage = [];
                    for (let i in response.data)
                        this.usersPage.push(response.data[i]["username"]);
                });
                axios({
                    url: "https://tierion-jvm-project.herokuapp.com/api/users/count",
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                }).then(response => {
                    this.pages = response.data.count;
                });
            }
        },
        beforeRouteUpdate() {
            this.refresh()
        },
        created() {
            this.refresh();
        }
    }
</script>

<style scoped>

</style>
