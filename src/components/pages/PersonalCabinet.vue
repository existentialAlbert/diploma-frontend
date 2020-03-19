<template>
    <div>
        <h1>
            {{this.$route.params.username}}
        </h1>
        <ErrorBox v-bind:errors="errorRow"></ErrorBox>
        <h4>
            Персональная информация
        </h4>
        <div class="container form-control shadow-sm col-6">
            <div v-for="(value, key) in names" v-bind:key="key">
                <template v-if="!editing">
                    <template v-if="key !== 'password'">
                        {{value}}:
                        <label v-if="info[key] != null"> {{info[key]}} </label>
                        <label v-else>не заполнено</label>
                        <br/>
                    </template>
                </template>
                <template v-else>
                    <form @submit="updateInfo" onsubmit="return false;">
                        {{value}}: <br>
                        <label v-if="newData[key] !== undefined">

                            <input class="form-control" v-if="key === 'birthday'" type="text" @input="validate" v-model="newData[key]"
                                   placeholder="mm/dd/yyyy">
                            <input class="form-control" v-else type="text" @change="changed = true" :placeholder="newData[key]"
                                   v-model="newData[key]">
                        </label>
                        <label v-else> {{info[key]}} </label>
                        <br/>
                    </form>
                </template>
            </div>
            <button class="btn btn-outline-secondary" v-if="changed && editing" @click="updateInfo" type="submit">
                Сохранить изменения
            </button>
            <button class="btn btn-outline-secondary" v-if="!editing && allowed" @click="editing = true">Редактировать
            </button>
            <button class="btn btn-outline-secondary" v-if="editing" @click="editing = false">Отменить</button>
        </div>
        <div>
            <h2>Статистика по заданиям</h2>
            <Statistics type="user"></Statistics>
        </div>
    </div>
</template>

<script>
    import ErrorBox from "@/components/auxiliaries/ErrorBox";
    import Statistics from "@/components/auxiliaries/Statistics";

    const axios = require('axios').default;
    export default {
        name: "PersonalCabinet",
        components: {Statistics, ErrorBox},
        data() {
            return {
                info: {
                    "username": "",
                    "fio": "",
                    "password": "",
                    "email": "",
                    "birthday": "",
                    "role": "",
                    "status": "",
                    "id": null,
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
                secs: 0,
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
                if (this.errorRow.length === 0) {
                    axios.put(`users/${this.info.id}`, {
                        "id": this.info.id,
                        "fio": this.newData.fio,
                        "email": this.newData.email === "" ? null : this.newData.email,
                        "birthday": this.secs,
                        "password": this.newData.password === "" ? null : this.newData.password,
                        "role": localStorage.getItem("role"),
                        "status": localStorage.getItem("status"),
                        "username": localStorage.getItem("username")
                    }).then(() => {
                        this.editing = false;
                        this.changed = false;
                        for (let i in this.newData)
                            this.info[i] = this.newData[i];
                    }).catch(error => {
                        if (error.response.data.status === undefined)
                            for (let i of error.response.data.errors)
                                this.errorRow.push(i.message);
                        else this.errorRow.push(error.response.data.message);
                    });
                }
            },
            validate() {
                this.errorRow = [];
                this.changed = true;
                let str = this.newData.birthday.split("/");
                if (str.length < 3 || Number(str[0]) > 12) {
                    this.errorRow.push("Неверный формат даты! Введите дату в формате mm/dd/yyyy.");
                    return;
                }
                if (Number(str[2]) < 1920 || Number(str[2]) > 2015) {
                    this.errorRow.push("Некорректный год рождения!");
                    return;
                }
                let date = new Date(this.newData.birthday);
                if (date.toDateString() === "Invalid Date") {
                    this.errorRow.push("Неверный формат даты! Введите дату в формате mm/dd/yyyy.");
                    return;
                }
                this.secs = date.valueOf() / 1000 + 10800;
                this.errorRow = [];
            },
            getInfo: function (callback = () => {
            }) {
                axios.defaults.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
                axios(`users/username/${this.$route.params.username}`).then(response => {
                    this.info = response.data;
                    localStorage.setItem("id", this.info.id);
                    if (response.data.birthday != null) {
                        let date = response.data.birthday.split("-");
                        this.info.birthday = date[1] + "/" + date[2] + "/" + date[0];
                    }
                    localStorage.setItem("role", response.data.role);
                    callback();
                }).catch(error => {
                    for (let i of error.response.data.errors)
                        this.errorRow.push(i.message);
                });
            }
        },
        beforeRouteUpdate(to, from, next) {
            this.getInfo(next());
        },
        created() {
            this.getInfo();
        }
    }
</script>

<style scoped>

</style>
