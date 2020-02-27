<template>
    <div>
        <button @click="getInfo">Получить инфу</button>
        <ul v-for="i of info" v-bind:key="i">
            <li v-if="i !== null">{{i}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "PersonalCabinet",
        data() {
            return {
                info: [],
            }
        },
        watch:{
            $route(){
                this.info = [];
                this.getInfo();
            },
        },
        methods: {
            getInfo: function () {
                const axios = require('axios').default;
                axios({
                    url: `https://tierion-jvm-project.herokuapp.com/api/users/username/${this.$route.params.username}`,
                    method: "GET",
                    headers: {
                        "Content-Type": 'application/json',
                        'Accept': 'application/json',
                    },
                }).then(response => {
                    for (let i in response.data)
                        this.info.push(response.data[i]);
                });
            }
        },
    }
</script>

<style scoped>

</style>
