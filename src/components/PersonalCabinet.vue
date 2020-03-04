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
            </template>
            <template v-else>
                <form @submit="updateInfo" onsubmit="return false;">
                    <label>
                        <input type="text" v-bind:value="info[index]">
                    </label>
                    <br/>
                    <button type="submit">Сохранить изменения</button>
                </form>
            </template>
        </ul>
        <button v-if="allowed" @click="editing = true">Редактировать</button>

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
                names: ['Пароль', 'Фамилия, имя и отчество',
                    'Почта', 'День рождения',],
                newData: "",
                value: ""
            }
        },
        computed: {
            allowed() {
                return this.$route.params.username === localStorage.getItem("name");
            }
        },
        methods: {
            updateInfo: function () {
                const axios = require('axios').default;
                axios({
                    url: `https://tierion-jvm-project.herokuapp.com/api/users/${localStorage.getItem("name")}`,
                    method: "PUT",
                    data: {
                        "id": this.info[0],
                        "fio": this.info[1],
                        "email": this.info[2],
                        "birthday": ""
                        ,
                        "password": "string",
                        "role": "string",
                        "status": "string",
                        "username": "string"
                    }

                }).then();
                console.log("a")
            },
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
        beforeMount() {
            this.info = [];
            this.info.push(localStorage.getItem("id"), localStorage.getItem("username"), localStorage.getItem("fio"), localStorage.getItem("email"),
                localStorage.getItem("birthday"), localStorage.getItem("role"), localStorage.getItem("status"));
            this.getInfo();
        },
        beforeRouteUpdate(to, from, next) {
            this.getInfo(to.params.username);
            next()
            /*alert("b");
            */
        }
        ,
        beforeCreate() {
            const axios = require('axios').default;
            axios({
                url: `https://tierion-jvm-project.herokuapp.com/api/users/username/${this.$route.params.username}`,
                method: "GET",
                headers: {
                    "Content-Type": 'application/json',
                    'Accept': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
            }).then(response => {
                for (let i in response.data)
                    localStorage.setItem(i, response.data[i]);
            });
        }
        /* beforeRouteLeave(to, from, next){

         }*/
    }
</script>

<style scoped>

</style>
