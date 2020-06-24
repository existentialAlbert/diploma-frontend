<template>
    <div>
        <br>
        <h2>Симуляция</h2>
        <button :class="control_btn" style="" @click="advance" :disabled="inAnimation">Следующий шаг</button>
        <button :class="control_btn" @click="stop" :disabled="inAnimation">Отменить симуляцию</button>
        <button :class="control_btn" @click="showMemory" :disabled="inAnimation">Память
            симуляции
        </button>
        <br>
        <br>
        <div @click="off" @keydown="off" id="overlay">
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
                        <text-highlight :highlightClass="highlight" :queries="bytecodeLines[instructionIndex]">
                            {{i}}
                        </text-highlight>
                    </template>
                    <template v-else>
                        {{i}}
                    </template>
                    <br>
                </span>
                <br><label v-html="instructionDescription"></label>
            </div>
            <table class="stack">
                <tr>
                    <td style="min-width: 425px;width: 425px; height: 35px"><h3>Фреймы</h3></td>
                    <td style="min-width: 140px;width: 140px; height: 35px;"><h3>Локальные переменные</h3></td>
                    <td style="min-width: 140px;width: 140px; height: 35px;"><h3>Стек операндов</h3></td>
                </tr>
                <tr>
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
                stack_unit: 'stack_unit rounded',
                control_btn: 'control_btn btn btn-outline-dark',
                highlight: 'highlight',
                stack: {
                    'frames': [],
                    'localVariables': [],
                    'operands': [],
                },
                array: [],
                stacksNumber: ['frames', 'localVariables', 'operands'],
                instructionIndex: 0,
                newInstructionIndex: 0,
                instructionDescription: "",
                newInstructionDescription: "",
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
                        row.push(`<label> <strong>${stacks['localVariables'][i].index}.</strong> ${stacks['localVariables'][i].typeName}: ${stacks['localVariables'][i].value}</label>`);
                    else row.push(null);
                    if (stacks.operands[i] != null)
                        row.push(`<label>${stacks['operands'][i].typeName}: ${stacks['operands'][i].value}</label>`);
                    else row.push(null);
                    rows.push(row);
                }
                return rows;
            },
            memoryInRussian() {
                let preprocess = function (object, depth = 1) {
                    console.log(typeof object)
                    let str = '';
                    if (typeof object === "object")
                        for (let subobject in object) {
                            console.log(subobject)
                            console.log(typeof subobject)
                            console.log(object[subobject])
                            console.log(typeof object[subobject])
                            if (typeof object[subobject] === "object" && object[subobject] != null)
                                str += preprocess(object[subobject], depth + 1);
                            else {
                                let tab = '-';
                                for (let i = 1; i < depth; i++)
                                    tab += tab;
                                str += tab + ' ' + `${subobject}: ${object[subobject]}<br>`
                            }
                        }
                    else
                        str = '- ' + `${object}`;
                    return str;
                };
                let translatedMemory = [];
                for (let i = 0; i < this.memory.length; i++) {
                    let strs = [`Ссылка: ${this.memory[i].reference}`,
                        `Имя класса: ${this.memory[i].className}`,
                        `Объект: <br>${preprocess(this.memory[i]['object'])}`];
                    translatedMemory.push(strs)
                }
                return translatedMemory;
            }
        },
        methods: {
            pop(row, index, data, i, current = 1) {
                let column = document.getElementsByName(row);
                let rm = animations.removeAnimation();
                let up = animations.upperAnimation();
                let t;
                t = column[1].animate(rm, animations.timing());
                t.onfinish = () => {
                    column[1].innerHTML = '';
                    column[1].classList.remove('stack_unit');
                };
                for (let j = 2; j < column.length; j++)
                    t = column[j].animate(up, animations.timing());
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
                let neww = animations.newAnimation();
                let low = animations.lowerAnimation();
                let b = td.animate(neww, animations.timing());
                let t;
                for (let i = 0; i < c.length; i++)
                    for (let j = 1; j < c[i].length; j++)
                        if (i !== row) {
                            let hold = animations.hold();
                            t = c[i][j].animate(hold, animations.timing());
                        } else {
                            t = c[i][j].animate(low, animations.timing());
                        }
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
            put(data, row = 0, i = 1) {
                this.inSimulation = true;
                if (row >= 3) {
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
                let equal = false;
                if (this.stack[column][oldLen - i] !== undefined && col[newLen - i] !== undefined)
                    if (column === 'frames') {
                        if (this.stack[column][oldLen - i]['className'] === col[newLen - i]['className'] &&
                            this.stack[column][oldLen - i].method === col[newLen - i].method)
                            equal = true;
                    } else if (column === 'operands') {
                        if (this.stack[column][oldLen - i]['typeName'] === col[newLen - i]['typeName']
                            && this.stack[column][oldLen - i]['value'] === col[newLen - i]['value'])
                            equal = true;
                    } else if (column === 'localVariables') {
                        if (this.stack[column][oldLen - i]['typeName'] === col[newLen - i]['typeName']
                            && this.stack[column][oldLen - i]['value'] === col[newLen - i]['value']
                            && this.stack[column][oldLen - i]['index'] === col[newLen - i]['index'])
                            equal = true;
                    }
                if (i <= newLen) {
                    if (this.stack[column][oldLen - i] === undefined) {
                        let text = column === 'frames' ?
                            `<label><strong>${col[newLen - i].className}</strong><br/>${col[newLen - i].method}` :
                            column === 'localVariables' ?
                                `<label> <strong>${col[newLen - i].index}.</strong> ${col[newLen - i].typeName}: ${col[newLen - i].value}</>` : `<label>${col[newLen - i].typeName}: ${col[newLen - i].value}</label>`;
                        setTimeout(() => {
                            this.push(row, text, col[newLen - i], data, i);
                        }, 350);
                        return;
                    } else if (!equal) {
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
                        this.instructionIndex = this.newInstructionIndex;
                        this.instructionDescription = '<strong>Описание текущей инструкции:</strong> ' + this.newInstructionDescription;
                        let b = document.getElementById('description')
                            .animate(animations.rightAnimation(), animations.easeOutTiming());
                        b.onfinish = () => {
                            this.inAnimation = false;
                            if (localStorage.getItem('inSimulation') === 'false')
                                this.$router.push('/simulation/start');
                        }
                    }
                } else {
                    this.inAnimation = false;
                    this.instructionDescription = '<strong>Описание текущей инструкции:</strong> ' + this.newInstructionDescription;
                    this.instructionIndex = this.newInstructionIndex;

                }
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

                axios('simulation/current').then(response => {
                    this.newInstructionIndex = response.data.instructionIndex;
                    this.newInstructionDescription = response.data.instructionDescription;
                    this.newBytecodeLines = response.data.bytecodeLines;
                    this.put(response.data.stack);
                    if (response.data.status === 'FINISHED') {
                        alert('status: ' + response.data.status);
                        this.stop();
                    }
                }).catch(() => {
                });
                axios('simulation/current/memory').then(response => {
                    this.memory = response.data.memory;
                });
            },
            advance() {
                this.inAnimation = true;
                axios.put('simulation/current/advance').then(response => {
                    this.newInstructionIndex = response.data.instructionIndex;
                    this.newInstructionDescription = response.data.instructionDescription;
                    this.newBytecodeLines = response.data.bytecodeLines;
                    this.put(response.data.stack);
                    if (response.data.status === 'FINISHED') {
                        alert('status: ' + response.data.status);
                        this.stop();
                    }
                }).catch(() => {
                    this.stop()
                });
                axios('simulation/current/memory').then(response => {
                    this.memory = response.data.memory;
                });
            },
            stop() {
                axios.delete('simulation/current').then(() => {
                    localStorage.setItem("inSimulation", "false");
                    this.$router.push("/simulation/start")
                }).catch(() => {
                        localStorage.setItem("inSimulation", "false");
                        this.$router.push("/simulation/start")
                    }
                )
                ;
            },
        },
        created() {
            this.current();
        }
    }
</script>

<style scoped>
    .control_btn {
        margin-left: 0.5%;
        margin-right: 0.5%;
    }

    .overlay_text {
        background-color: white;
        margin: 11% auto;
        min-height: 40%;
        text-align: left;
        border: 1px solid;
        max-height: 60%;
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
        max-width: 30%;
        min-width: 30%;
        min-height: 40%;
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

    .highlight {
        background: dodgerblue;
    }
</style>
