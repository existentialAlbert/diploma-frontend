<template>
    <div>
        <h1>Симуляция</h1>
        <form onsubmit="return false">
            <textarea v-model="code" rows="10" cols="50" placeholder="код для симуляции">
            </textarea>
            <br>
            <button @click="start" :disabled="inAnimation">Начать симуляцию</button>
            <button @click="stop" v-if="visible" :disabled="inAnimation">Отменить симуляцию</button>
        </form>
        <button @click="advance" :disabled="inAnimation">Следующий шаг
        </button>
        <div>
            <table class="stack">
                <tr>
                    <td style="width: 550px">frames</td>
                    <td style="width: 200px">local variables</td>
                    <td style="width: 200px">operands</td>
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
    function lowerAnimation() {
        return [{transform: `translateY(-${76}px)`},
            {transform: `translateY(${10}px)`}]
    }

    function newAnimation() {
        return [{
            transform: `translateY(-${76}px)`,
            opacity: '0%'
        },
            {opacity: '0%', offset: 0.5},
            {
                transform: `translateY(${10}px)`,
                opacity: '100%'
            }]
    }

    function timing() {
        return {
            duration: 1000,
            easing: 'ease-in'
        }
    }


    function upperAnimation() {
        return [{transform: `translateY(${2}px)`},
            {transform: `translateY(${-76}px)`}]
    }

    function removeAnimation() {
        return [{transform: `translateY(${2}px)`, opacity: '100%'},
            {opacity: '100%', offset: 0.5},
            {transform: `translateY(${-76}px)`, opacity: '0%'}]
    }

    function hold() {
        const a = -73;
        return [{transform: `translateY(${a}px)`},
            {transform: `translateY(${a}px)`}]
    }

    const axios = require('axios').default;
    export default {
        name: "StackComponent",
        data() {
            return {
                bytecodeLines: [],
                visible: false,
                inAnimation: false,
                stack_unit: 'stack_unit',
                stack: {
                    'frames': [],
                    'localVariables': [],
                    'operands': [],
                },
                newStack: {},
                stacksNumber: ['frames', 'localVariables', 'operands'],
                instructionIndex: 0,
                code: "package test;\n\npublic class Test {\n public static void main(String[] args) {\n int i = Integer.valueOf(1488);\n }\n}",
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
                    //row.push(stacks['frames'][i]);
                    else row.push(null);
                    if (stacks.localVariables[i] != null)
                        row.push(`<label>${stacks['localVariables'][i].typeName}: ${stacks['localVariables'][i].value}</label>`);
                    //row.push(stacks['localVariables'][i]);
                    else row.push(null);
                    if (stacks.operands[i] != null)
                        row.push(`<label>${stacks['operands'][i].typeName}: ${stacks['operands'][i].value}</label>`);
                    //row.push(stacks['operands'][i]);
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
                t = column[1].animate(removeAnimation(), timing());
                t.onfinish = () => {
                    column[1].innerHTML = '';
                    column[1].classList.remove('stack_unit');
                };
                for (let j = 2; j < column.length; j++)
                    t = column[j].animate(upperAnimation(1), timing(1));
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
                let b = td.animate(newAnimation(), timing());
                let t;
                for (let i = 0; i < c.length; i++)
                    for (let j = 1; j < c[i].length; j++)
                        if (i !== row)
                            t = c[i][j].animate(hold(), timing());
                        else
                            t = c[i][j].animate(lowerAnimation(), timing());
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
                this.inAnimation = true;
                if (row >= 3) {
                    this.inAnimation = false;
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
                } else {
                    this.put(data, row + 1);
                }
            },
            start() {
                axios.post("simulation/start", {"code": this.code})
                    .then(response => {
                        this.put(response.data.stack);
                        this.bytecodeLines = response.data.bytecodeLines;
                        //this.visible = true;
                    });
            },
            current() {
                axios.put('simulation/current').then(response => {
                    this.put(response.data.stack);
                    this.bytecodeLines = response.data.bytecodeLines;
                    if (response.data.status === 'FINISHED')
                        this.stop();

                });
            },
            advance() {
                axios.put('simulation/advance').then(response => this.put(response.data.stack)).catch(() => {
                    this.stop()
                });
            },
            stop() {
                axios.delete('simulation').then(() => {
                    //this.visible = false;
                });
            },
        }
        ,
        created() {
            this.current();
        }
    }
</script>

<style scoped>
    #description {
        max-width: 400px;
        text-overflow: ellipsis;
        padding-right: 2%;
        padding-left: 0;
        text-align: left;
        vertical-align: top
    }

    .stack_unit {
        border: black 1px solid;
        height: 75px;
    }

    .stack {
        border-collapse: separate;
        height: auto;
        margin: auto;
        border-spacing: 1em 3px;
    }
</style>
