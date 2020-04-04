<template>
    <div>
        <h1>Пользователи</h1>
        <a v-for="user in page" @click="sendToUser(user.username)" v-bind:key="user">
            {{user.username}} - {{user.role}}
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
                page: [],
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
            refresh(callback) {
                axios(`api/users/page/${this.$route.params.page}/size/${this.usersOnOnePage}`).then(response => {
                    this.page = [];
                    for (let i in response.data)
                        this.page.push(response.data[i]);
                });
                axios("api/users/count").then(response => {
                    this.users = response.data.count;
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
