<template>
    <div>
        <a v-for="i in usersPage" href="" @click="sendToUser(i)" v-bind:key="i">
            {{i}}
            <br/>
        </a>
        <Pagination v-bind:amount="pages - 1" url="/users/page/"></Pagination>
    </div>
</template>

<script>
    import Pagination from "@/components/auxiliaries/Pagination";

    const axios = require('axios').default;
    export default {
        name: "UsersPage",
        components: {Pagination},
        data: function () {
            return {
                pageNumber: Number(this.$route.params.page),
                users: 0,
                usersOnOnePage: 10,
                usersPage: [],
            }
        },
        computed: {
            pages() {
                return Math.ceil(this.users / this.usersOnOnePage);
            }
        },
        methods: {
            sendToUser(i) {
                this.$router.push('/users/user/' + i);
            },
            refresh() {
                axios(`users/page/${this.$route.params.page}/size/10`).then(response => {
                    this.usersPage = [];
                    for (let i in response.data)
                        this.usersPage.push(response.data[i]["username"]);
                }).catch(error => {
                    console.log(error)
                });
                axios("users/count").then(response => this.users = response.data.count).catch(error => {
                    console.log(error)
                });
            }
        },
        created() {
            this.refresh();
        },
    }
</script>

<style scoped>

</style>
