<template>
    <div>
        <h1>
            Генерация нового задания
        </h1>
        <form class="form-group shadow-sm" onsubmit="return false">
            <h4>Сложность</h4>
            <label>
                <select v-model="chosenDifficulty" class="form-control shadow-sm">
                    <option v-for="diff in difficulties" v-bind:key="diff">{{diff.caption}}
                    </option>
                </select>
            </label>
            <br/>
            <h4>Тип задания</h4>
            <label>
                <select v-model="chosenType" class="form-control shadow-sm">
                    <option v-for="type in types" v-bind:key="type">{{type.caption}}
                    </option>
                </select>
            </label>
        </form>
        <button @click="create" class="btn btn-outline-primary">Создать задачу!</button>
    </div>
</template>

<script>
    const axios = require('axios').default;
    export default {
        name: "TaskGenerator",
        data() {
            return {
                types: [],
                difficulties: [],
                chosenDifficulty: "Легкий",
                chosenType: "Пул констант",
            }
        },
        methods: {
            create() {
                let d, t;
                this.types.forEach(element => {
                    console.log(this.chosenType + " " + element.caption + " " + (this.chosenType === element.type));
                    if (element.caption === this.chosenType)
                        t = element.type;
                });
                this.difficulties.forEach(element => {
                    console.log(element.caption);
                    if (element.caption === this.chosenDifficulty)
                        d = element.difficulty;
                });
                console.log(t, d);
                axios.post("api/tasks", {
                    "taskDifficulty": d,
                    "taskType": t
                }).then(response => {
                    this.$router.push(`/tasks/task/${response.data.id}`)
                });
            },
        },
        created() {
            axios("api/tasks/difficulties").then(response => {
                this.difficulties = response.data;
            });
            axios("api/tasks/types").then(response => {
                this.types = response.data;
            });
        },
    }
</script>

<style scoped>

</style>
