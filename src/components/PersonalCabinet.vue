<template>
    <div>
        <h1>
            {{this.$route.params.username}}
        </h1>
        <h2>
            Персональная информация
        </h2>
        <ul v-for="(name, index) in names" v-bind:key="name">
            {{name}}:
            <template v-if="!editing">
                <label v-if="info[index] != null"> {{info[index]}} </label>
                <label v-else>Заполните это поле</label>
                <br/>
                <button v-if="allowed" @click="editing = true">Редактировать</button>
            </template>
            <template v-else>
                <form @submit="submit" onsubmit="return false;">
                    <label>
                        <input v-bind:value="newData">
                    </label>
                </form>
            </template>
        </ul>
        <button v-if="changed">Сохранить изменения</button>
    </div>
</template>

<script>
    export default {
        name: "PersonalCabinet",
        data() {
            return {
                info: [],
                changed: false,
                editing: false,
                names: ['Имя пользователя', 'Фамилия, имя и отчество',
                    'Почта', 'День рождения', 'Роль', 'Статус'],
            }
        },
        computed: {
            allowed() {
                return this.$route.params.username === localStorage.getItem("name");
            }
        },
        methods: {
            getInfo: function (user = this.$route.params.username) {
                this.info = [];
                const axios = require('axios').default;
                axios({
                    url: `https://tierion-jvm-project.herokuapp.com/api/users/username/${user}`,
                    method: "GET",
                    headers: {
                        "Content-Type": 'application/json',
                        'Accept': 'application/json',
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                }).then(response => {
                    let a = 0;
                    for (let i in response.data) {
                        if (a > 0)
                        this.info.push(response.data[i]);
                        /*console.log(i + " " + response.data[i])
                        console.log(localStorage.getItem(i))*/
                        a++;
                    }
                });
            }
        },
        created() {
            this.getInfo();
        },
        beforeRouteUpdate(to, from, next) {
            this.getInfo(to.params.username);
            next()
            /*alert("b");
            this.info.push(localStorage.getItem("username"), localStorage.getItem("fio"), localStorage.getItem("email"),
                localStorage.getItem("birthday"), localStorage.getItem("role"), localStorage.getItem("status"));*/
        }
        ,
        /* beforeRouteLeave(to, from, next){

         }*/
    }
</script>

<style scoped>

</style>
