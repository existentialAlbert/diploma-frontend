<template>
    <div>
        <h1>
            {{this.$route.params.username}}
        </h1>
        <h2>
            Персональная информация
        </h2>
        <ul v-for="(name, index) in names" v-bind:key="name">
            {{name}}: <InfoInput edit="false" v-bind:data="info[index+1]"></InfoInput>
        </ul>
        <button v-if="changed">Сохранить изменения</button>
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
                changed: false,
                names: ['Имя пользователя','Фамилия, имя и отчество',
                    'Почта', 'День рождения', 'Роль', 'Статус'],
            }
        },
        beforeMount() {
            this.getInfo();
        },

        methods: {
            getInfo: function () {
                /*if (localStorage.getItem("info") != undefined) {
                    this.info = localStorage.getItem("info");
                    return;
                }*/
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
                    for (let i in response.data) {
                        this.info.push(response.data[i]);
                    }
                    /*
                                        localStorage.setItem("info", this.info);
                    */
                });
            }
        },
    }
</script>

<style scoped>

</style>
