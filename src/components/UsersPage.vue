<template>
    <div>
        <a v-for="i in usersPage" href="" @click="sendToUser(i)" v-bind:key="i">
            {{i}}
            <br/>
        </a>
    </div>
</template>

<script>
    export default {
        name: "UsersPage",
        data: function () {
            return {
                pageNumber: 0,
                usersPage: [],
            }
        },
        methods: {
            getPage: function () {
                const axios = require('axios').default;
                axios({
                    url: `https://tierion-jvm-project.herokuapp.com/api/users/page/${this.pageNumber}/size/10`,
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                    }
                }).then(response => {
                    for (let i in response.data)
                        this.usersPage.push(response.data[i]["username"]);
                });
            },
            sendToUser(i){
                this.$router.push('/users/user/' + i);
            }
        },
        mounted() {this.getPage();
        }
    }
</script>

<style scoped>

</style>
