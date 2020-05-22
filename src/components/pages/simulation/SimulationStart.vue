<template>
    <div>
        <br>
        <h1>Симуляция</h1>
        <br>
        <ErrorBox :errors="errorRow">
        </ErrorBox>
        <br>
        <form onsubmit="return false">
            <label style="text-align: left; "><h3>Код для симуляции</h3>
                <textarea class="shadow-sm form-group rounded" rows="20" cols="75"
                          v-model="code">
                </textarea>
            </label>
            <br>
            <button class="btn btn-outline-primary" id='startButton' style="margin-bottom: 3%" @click="start">
                Начать симуляцию
            </button>
            <br/>
        </form>
    </div>
</template>

<script>
    import ErrorBox from "@/components/auxiliaries/ErrorBox";
    import $ from 'jquery'

    $(document).keydown(function (event) {
        // не кнопка tab - выходим
        if (event.keyCode !== 9)
            return;

        event.preventDefault();

        // Opera, FireFox, Chrome
        var textarea = $("textarea")[0],
            selStart = textarea.selectionStart,
            selEnd = textarea.selectionEnd,
            selection = textarea.value.substring(selStart, selEnd),
            selection_new = '',
            before = textarea.value.substring(0, selStart),
            after = textarea.value.substring(selEnd, textarea.value.length);

        // добавляем tab
        if (!event.shiftKey) {
            selStart++;
            if (selection.trim())
                selection_new = selection.replace(/^/gm, function () {
                    selEnd++;
                    return "\t";
                });
            else {
                selection_new = "\t";
                selEnd++;
            }
        }
        // убриаем табы
        else {
            // если символ до выделения тоже \t удаляем и его
            if (before[before.length - 1] === "\t") {
                before = before.substring(0, before.length - 1);
                selStart--;
                selEnd--;
            }

            selection_new = selection.replace(/^\t/gm, function () {
                selEnd--;
                return "";
            });
        }

        textarea.value = before + selection_new + after;

        // курсор
        textarea.setSelectionRange(selStart, selEnd);
    });

    const axios = require('axios').default;
    export default {
        components: {ErrorBox},
        name: "SimulationStart",
        data() {
            return {
                code: (localStorage.getItem('code') == null || localStorage.getItem("code") === "") ?
                    'package test;\npublic class Test ' +
                    '{\n\t public static void main(String[] args) {\n\t\t' + "\n" + "\n\t}\n}" : localStorage.getItem("code"),
                errorRow: [],
            }
        },
        watch: {
            code() {
                localStorage.setItem("code", this.code);
            }
        },
        beforeCreate() {
            if (localStorage.getItem("inSimulation") == null)
                axios('simulation/current').then(() => {
                    localStorage.setItem("inSimulation", "true");
                    this.$router.push({path: '/simulation'});
                }).catch(() => {
                        localStorage.setItem("inSimulation", "false");
                    }
                );
        },
        methods: {
            start() {
                axios.post("simulation/current", {"code": this.code}).then(() => {
                    localStorage.setItem("inSimulation", "true");
                    this.$router.push('/simulation');
                }).catch(error => {
                    this.errorRow = [];
                    this.errorRow.push(error.response.data.message);
                });
            },
        }
    }
</script>

<style scoped>

</style>
