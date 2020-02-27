<template>
    <div>
        <h1>
            Ваша персональная информация
        </h1>
        <InfoInput v-bind:data="info" v-bind:names="['Имя пользователя','Фамилия, имя и отчество',
            'Ваша почта', 'Ваш день рождения', 'Роль', 'Статус']"></InfoInput>
    </div>
</template>

<script>
    import InfoInput from "@/components/PersonalCabinet/InfoInput";

    export default {
        name: "PersonalCabinet",
        components: {InfoInput},
        data() {
            return {
                info: [],
            }
        },
        mounted() {
            this.getInfo();
        },
        watch: {
            $route() {
                this.info = [];
                this.getInfo();
            },

        },
        methods: {
            getInfo: function () {
                this.info = [];
                const axios = require('axios').default;
                axios({
                    url: `https://tierion-jvm-project.herokuapp.com/api/users/username/${this.$route.params.username}`,
                    method: "GET",
                    headers: {
                        "Content-Type": 'application/json',
                        'Accept': 'application/json',
                        "Authorization": "Bearer " + localStorage.getItem("token")
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
