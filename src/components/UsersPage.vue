<template>
    <div>
        <ul v-for="i in usersPage" v-bind:key="i">
            <li> {{i}}</li>
        </ul>
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
                    url: `https://tierion-jvm-project.herokuapp.com/api/users/page/${0}/size/10`,
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                    }
                }).then(response => {
                    for (let i in response.data)
                        this.usersPage.push(i.fio);
                });
            }
        },

    }
</script>

<style scoped>

</style>
