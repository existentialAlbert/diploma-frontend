<template>
    <div>
        <h1>
            {{this.$route.params.username}}
        </h1>
        <h2>
            Персональная информация
        </h2>
        <ul v-for="(value, key) in names" v-bind:key="key">
            {{value}}:
            <template v-if="!editing">
                <label v-if="info[key] != null"> {{info[key]}} </label>
                <label v-else>Заполните это поле</label>
                <br/>
            </template>
            <template v-else>
                <form @submit="updateInfo" onsubmit="return false;">
                    <label v-if="newData[key] !== undefined">
                        <input type="text" @input="changed = true" v-model="newData[key]">
                        <br/>
                    </label>
                    <label v-else> {{info[key]}} </label>
                </form>
            </template>
        </ul>
        <button v-if="changed && editing" @click="updateInfo" type="submit">Сохранить изменения</button>
        <button v-if="!editing && allowed" @click="editing = true">Редактировать</button>
        <button v-if="editing" @click="editing = false">Отменить</button>
    </div>
</template>

<script>
    export default {
        name: "PersonalCabinet",
        data() {
            return {
                info: {
                    "username": "",
                    "fio": "",
                    "password": "Кликните редактировать, чтобы изменить",
                    "email": "",
                    "birthday": 0,
                    "role": "",
                    "status": "",
                },
                changed: false,
                editing: false,
                errorRow: [],
                names: {
                    "username": 'Никнейм пользователя',
                    "fio": 'Фамилия, имя и отчество',
                    "password": 'Пароль',
                    "email": 'Электронная почта',
                    "birthday": 'День рождения',
                    "role": 'Роль',
                    "status": 'Статус'
                },

            }
        },
        computed: {
            allowed() {
                return this.$route.params.username === localStorage.getItem("name");
            },
            newData() {
                return {
                    "birthday": this.info.birthday,
                    "email": this.info.email,
                    "fio": this.info.fio,
                    "password": "",
                }
            },
        },
        methods: {
            updateInfo: function () {
                const axios = require('axios').default;
                axios({
                    url: `https://tierion-jvm-project.herokuapp.com/api/users/${this.info.id}`,
                    method: "PUT",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                    },
                    data: {
                        "id": this.info.id,
                        "fio": this.newData.fio,
                        "email": this.newData.email === ""? null : this.newData.email,
                        "birthday": Date.parse(this.newData.birthday),
                        "password": this.newData.password === "" ? null : this.newData.password,
                        "role": localStorage.getItem("role"),
                        "status": localStorage.getItem("status"),
                        "username": localStorage.getItem("username"),
                    }
                }).then(() => {
                    this.editing = false;
                    this.changed = false;
                    for (let i in this.newData)
                        this.data[i] = this.newData[i];
                });
            },
            getInfo: function (callback = () => {
            }) {
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
                        this.info[i] = response.data[i];
                    callback();
                });
            }
        },
        beforeRouteUpdate(to, from, next) {
            this.getInfo(next());
        },
        created() {
            this.getInfo();
            /*const axios = require('axios').default;
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
                    this.info[i] = response.data[i];
            });*/
        }
    }
</script>

<style scoped>

</style>
