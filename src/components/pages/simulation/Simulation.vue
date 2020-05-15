<template>
    <div>
        <h2 id="anchor1">Стек</h2>
        <button @click="advance" :disabled="inAnimation">Следующий шаг</button>
        <button @click="stop" :disabled="inAnimation">Отменить симуляцию</button>
        <button @click="showMemory" :disabled="inAnimation">Показать память симуляции</button>
        <br>
        <br>
        <div @click="off" id="overlay">
            <div class="overflow-auto container col-4 overlay_text shadow-sm rounded">
                <br>
                <div v-for="i in memoryInRussian" :key="i">
                    <div v-for="j in i" :key="j" v-html="j">
                        <br>
                    </div>
                    <br>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center">
            <div id="description" class="overflow-auto description">
                <span v-for="(i, index) in bytecodeLines" :key="i">
                    <template v-if="index === instructionIndex">
                        <text-highlight :queries="bytecodeLines[instructionIndex]">
                            {{i}}
                        </text-highlight>
                    </template>
                    <template v-else>
                        {{i}}
                    </template>
                    <br>
                </span>
            </div>
            <table class="stack">
                <tr>
                    <td style="width: 425px; height: 35px"><h3>Фреймы</h3></td>
                    <td style="width: 140px; height: 35px;"><h3>Локальные переменные</h3></td>
                    <td style="width: 140px; height: 35px;"><h3>Стек операндов</h3></td>
                </tr>

                <tr :id="0">
                    <td :name="0"></td>
                    <td :name="1"></td>
                    <td :name="2"></td>
                </tr>

                <tr v-for="(row, index) in rows" :id="index+1" :key="row">
                    <td :name="index1" v-for="(item, index1) in row" :key="item"
                        :class="item == null?'':stack_unit" v-html="item">
                    </td>
                </tr>
            </table>
        </div>
    </div>

</template>

<script>
    import animations from "@/components/pages/animations";

    function equals(arr1, arr2) {
        if (arr1.length !== arr2.length)
            return false;
        for (let i = 0; i < arr2.length; i++)
            if (arr1[i] !== arr2[i])
                return false;
        return true
    }

    const axios = require('axios').default;
    export default {
        name: "StackComponent",
        data() {
            return {
                bytecodeLines: [],
                newBytecodeLines: [],
                memory: {},
                inAnimation: false,
                stack_unit: 'stack_unit',
                stack: {
                    'frames': [],
                    'localVariables': [],
                    'operands': [],
                },
                stacksNumber: ['frames', 'localVariables', 'operands'],
                instructionIndex: 0,
            }
        },
        computed: {
            max() {
                let stacks = this.stack;
                return Math.max(stacks.frames.length, stacks.localVariables.length, stacks.operands.length);
            },
            rows() {
                let rows = [];
                let stacks = this.stack;
                for (let i = 0; i < this.max; i++) {
                    let row = [];
                    if (stacks.frames[i] != null)
                        row.push(`<label><strong>${stacks['frames'][i].className}</strong><br>${stacks['frames'][i].method}</label>`);
                    else row.push(null);
                    if (stacks.localVariables[i] != null)
                        row.push(`<label>${stacks['localVariables'][i].typeName}: ${stacks['localVariables'][i].value}</label>`);
                    else row.push(null);
                    if (stacks.operands[i] != null)
                        row.push(`<label>${stacks['operands'][i].typeName}: ${stacks['operands'][i].value}</label>`);
                    else row.push(null);
                    rows.push(row);
                }
                return rows;
            },
            memoryInRussian() {
                let memory = [
                    {
                        "reference": -1,
                        "className": "null",
                        "object": null
                    },
                    {
                        "reference": -228,
                        "className": "java.lang.Integer",
                        "object": 128
                    },
                    {
                        "reference": -229,
                        "className": "net.tierion.jvm.learning.utils.bytecode.LocalVariable",
                        "object": {
                            "variableClass": "int",
                            "index": 0,
                            "test": {
                                "test": "test",
                                "test1": "test",
                                "test2": "test",
                                "test3": "test",
                                "test4": "test"
                            }
                        }
                    }
                ];
                let preprocess = function (object, depth = 1) {
                    let str = '';
                    for (let subobject in object)
                        if (typeof object[subobject] === "object")
                            str += preprocess(object[subobject], depth + 1);
                        else {
                            let tab = '-';
                            for (let i = 1; i < depth; i++)
                                tab += tab;
                            str += tab + ' ' + `${subobject}: ${object[subobject]} <br>`
                        }
                    return str;
                };
                let translatedMemory = [];
                for (let i = 0; i < memory.length; i++) {
                    let strs = [`Ссылка: ${memory[i].reference}`,
                        `Имя класса: ${memory[i].className}`,
                        `Объект: <br>${preprocess(memory[i].object)}`];
                    translatedMemory.push(strs)
                }
                return translatedMemory;
            }
        },
        methods: {
            pop(row, index, data, i, current = 1) {
                let column = document.getElementsByName(row);
                let t;
                t = column[1].animate(animations.removeAnimation(), animations.timing());
                t.onfinish = () => {
                    column[1].innerHTML = '';
                    column[1].classList.remove('stack_unit');
                };
                for (let j = 2; j < column.length; j++)
                    t = column[j].animate(animations.upperAnimation(), animations.timing());
                if (t === undefined) {
                    this.stack[this.stacksNumber[row]].shift();
                    this.put(data, row, i);
                    return;
                }
                t.onfinish = () => {
                    this.stack[this.stacksNumber[row]].shift();
                    if (current !== index)
                        setTimeout(() => {
                            this.pop(row, index, data, i, current + 1);
                        }, 350);
                    else this.put(data, row, i)
                };
            },
            push(row, element, el, data, i) {
                let c = [document.getElementsByName(0),
                    document.getElementsByName(1),
                    document.getElementsByName(2)];
                let td = document.getElementsByName(row)[0];
                td.classList.add('stack_unit');
                td.innerHTML = element;
                let b = td.animate(animations.newAnimation(), animations.timing());
                let t;
                for (let i = 0; i < c.length; i++)
                    for (let j = 1; j < c[i].length; j++)
                        if (i !== row) {
                            t = c[i][j].animate(animations.hold(), animations.timing());
                        } else
                            t = c[i][j].animate(animations.lowerAnimation(), animations.timing());
                if (t === undefined) {
                    b.onfinish = () => {
                        td.innerHTML = '';
                        td.classList.remove('stack_unit');
                        this.stack[this.stacksNumber[row]].unshift(el);
                        this.put(data, row, i + 1);
                    };
                    return;
                }
                t.onfinish = () => {
                    td.innerHTML = '';
                    td.classList.remove('stack_unit');
                    this.stack[this.stacksNumber[row]].unshift(el);
                    this.put(data, row, i + 1);
                };
            },
            put(data, row = 0, i = 1, callback = () => {
            }) {
                this.inSimulation = true;
                if (row >= 3) {
                    callback();
                    this.replaceBytecodeLines(this.newBytecodeLines);
                    return;
                }
                let column = this.stacksNumber[row];
                let col = data[column];
                let newLen = col.length;
                let oldLen = this.stack[column].length;
                if (oldLen > newLen) {
                    setTimeout(() => {
                        this.pop(row, oldLen - newLen, data, i);
                    }, 350);
                    return;
                }
                if (i <= newLen) {
                    if (this.stack[column][oldLen - i] === undefined) {
                        let text = column === 'frames' ?
                            `<label><strong>${col[newLen - i].className}</strong><br/>${col[newLen - i].method}` :
                            `<label>${col[newLen - i].typeName}: ${col[newLen - i].value}</label>`;
                        setTimeout(() => {
                            this.push(row, text, col[newLen - i], data, i);
                        }, 350);
                        return;
                    } else if (this.stack[column][oldLen - i] !== col[newLen - i]) {
                        setTimeout(() => {
                            this.pop(row, i, data, i)
                        }, 350);
                        return;
                    }
                    this.put(data, row, i + 1);
                } else
                    this.put(data, row + 1);
            },
            replaceBytecodeLines(newLines) {
                if (!equals(this.bytecodeLines, newLines)) {
                    let t = document.getElementById('description')
                        .animate(animations.leftAnimation(), animations.easeOutTiming());
                    t.onfinish = () => {
                        this.bytecodeLines = newLines;
                        let b = document.getElementById('description')
                            .animate(animations.rightAnimation(), animations.easeOutTiming());
                        b.onfinish = () => this.inAnimation = false
                    }
                } else this.inAnimation = false;
            },
            showMemory() {
                let overlay = document.getElementById("overlay");
                overlay.style.display = 'block';
                overlay.animate(animations.memoryAppearingAnimation(), animations.memoryTiming());
            },
            off() {
                let overlay = document.getElementById("overlay");
                let b = overlay.animate(animations.memoryDisappearingAnimation(), animations.memoryTiming());
                b.onfinish = () => overlay.style.display = 'none';
            },
            current() {
                this.inAnimation = true;
                axios('simulation/current/memory').then(response => {
                    this.memory = response.data.memory;
                });
                axios('simulation/current').then(response => {
                    this.newBytecodeLines = response.data.bytecodeLines;
                    this.put(response.data.stack);
                    this.instructionIndex = response.data.instructionIndex;
                    if (response.data.status === 'FINISHED')
                        this.stop();
                }).catch(() => {
                    this.stop();
                });
            },
            advance() {
                this.inAnimation = true;
                axios('simulation/current/memory').then(response => {
                    this.memory = response.data.memory;
                });
                axios.put('simulation/current/advance').then(response => {
                    this.newBytecodeLines = response.data.bytecodeLines;
                    this.put(response.data.stack);
                    this.instructionIndex = response.data.instructionIndex;
                    if (response.data.status === 'FINISHED')
                        this.stop();
                }).catch(() => {
                    this.stop()
                });
            },
            stop() {
                axios.delete('simulation/current').then(() => {
                    localStorage.setItem("inSimulation", "false");
                    this.$router.push('/simulation/start');
                }).catch(() => {
                    localStorage.setItem("inSimulation", "false");
                    this.$router.push('/simulation/start');
                });
            },
        },
        created() {
            this.current();
        }
    }
</script>

<style scoped>
    .overlay_text {
        background-color: white;
        margin: 11% auto;
        min-height: 300px;
        text-align: left;
        border: 1px solid;
        max-height: 500px;
        overflow-y: scroll;
    }

    #overlay {
        position: fixed;
        display: none;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 2;
        cursor: pointer;
    }

    h3 {
        font-size: 18px;
    }

    .description {
        max-width: 500px;
        min-width: 500px;
        min-height: 400px;
        height: 25%;
        overflow-y: scroll;
        text-align: left;
        vertical-align: top;
        font-size: 13px;
        float: left;
        padding-right: 2%;
        display: block;
    }

    .stack_unit {
        border: black 1px solid;
        min-height: 55px;
        max-height: 55px;
        height: 55px;
        min-width: 140px;
        max-width: 425px;
    }

    .stack {
        float: left;
        font-size: 13px;
        border-collapse: separate;
        border-spacing: 6px 1px;
    }
</style>
