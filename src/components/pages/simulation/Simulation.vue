<template>
    <div>
        <h2 id="anchor1">Стек</h2>
        <button @click="advance" :disabled="inAnimation">Следующий шаг</button>
        <button @click="stop" :disabled="inAnimation">Отменить симуляцию</button>
        <br>
        <br>
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
                    <td style="width: 425px; height: 35px"><h3>Frames</h3></td>
                    <td style="width: 125px; height: 35px;"><h3>Local variables</h3></td>
                    <td style="width: 125px; height: 35px;"><h3>Operands</h3></td>
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
                        .animate(animations.leftAnimation(), animations.linearTiming());
                    t.onfinish = () => {
                        this.bytecodeLines = newLines;
                        let b = document.getElementById('description')
                            .animate(animations.rightAnimation(), animations.linearTiming());
                        b.onfinish = () => this.inAnimation = false
                    }
                } else this.inAnimation = false;
            },
            current() {
                this.inAnimation = true;
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
                axios.put('simulation/advance').then(response => {
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
                axios.delete('simulation').then(() => {
                    localStorage.setItem("inSimulation", "false");
                    this.$router.push('/simulation/start');
                }).catch(()=> {
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
    h3 {
        font-size: 18px;
    }

    .description {
        max-width: 400px;
        min-width: 400px;
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
        height: 55px;
        min-width: 125px;
        max-width: 425px;
    }

    .empty {
        height: 0;
    }

    .stack {
        float: left;
        font-size: 13px;
        border-collapse: separate;
        border-spacing: 6px 1px;
    }
</style>
