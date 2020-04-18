<template>
    <div>
        <h1>Симуляция</h1>
        <form onsubmit="return false">
            <textarea v-model="code" rows="10" cols="50" placeholder="код для симуляции">
            </textarea>
            <br>
            <button @click="start">Начать симуляцию</button>
            <button @click="stop">Отменить симуляцию</button>

        </form>
        <button @click="put({'frames': [2, 3, 4, 5],
                    'localVariables': [2],
                    'operands': [2],}, 0)">Следующий шаг
        </button>
        <button>тест анимации</button>
        <div>
            <table class="stack">
                <tr>
                    <td id="description" :rowspan="rows.length + 3">
                        <label v-for="line in bytecodeLines" :key="line">
                            {{line}}
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>frames</td>
                    <td>local variables</td>
                    <td>operands</td>
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
    function lowerAnimation(amount) {
        return [{transform: `translateY(-${35}px)`},
            {transform: `translateY(${0 * amount}px)`}]
    }

    function timing() {
        return {
            duration: 500,
            easing: 'ease-in'
        }
    }

    function newAnimation() {
        return [{
            transform: `translateY(-${35}px)`,
            opacity: '0%'
        },
            {opacity: '0%', offset: 0.5},
            {
                transform: `translateY(${0}px)`,
                opacity: '100%'
            }]
    }


    function upperAnimation(amount) {
        return [{transform: `translateY(-${0}px)`},
            {transform: `translateY(${-35 * amount}px)`}]
    }

    function hold() {
        return [{transform: `translateY(${-32}px)`},
            {transform: `translateY(${-32}px)`}]
    }

    function removeAnimation() {
        return [{
            transform: `translateY(0px)`,
            opacity: '100%'
        },
            {opacity: '0%', offset: 0.5},
            {
                transform: `translateY(${-45}px)`,
                opacity: '0%'
            }]
    }

    const axios = require('axios').default;
    export default {
        name: "StackComponent",
        data() {
            return {
                bytecodeLines: [],
                visible: false,
                stack_unit: 'stack_unit',
                stack: {
                    'frames': [1],
                    'localVariables': [1, 8],
                    'operands': [1],
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
                    //row.push(`<label><strong>${stacks['frames'][i].className}</strong><br>${stacks['frames'][i].method}</label>`);
                        row.push(stacks['frames'][i]);
                    else row.push(null);
                    if (stacks.localVariables[i] != null)
                    //row.push(`<label>${stacks['localVariables'][i].typeName}: ${stacks['localVariables'][i].value}</label>`);
                        row.push(stacks['localVariables'][i]);

                    else row.push(null);

                    if (stacks.operands[i] != null)
                    //row.push(`<label>${stacks['operands'][i].typeName}: ${stacks['operands'][i].value}</label>`);
                        row.push(stacks['operands'][i]);

                    else row.push(null);
                    rows.push(row);
                }
                return rows;
            },
        },
        methods: {
            pop(row, data, i) {
                let column = document.getElementsByName(row);
                let td = document.getElementsByName(row)[1];
                td.animate(removeAnimation(), timing());
                let t;
                for (let j = 2; j < column.length; j++)
                    t = column[j].animate(upperAnimation(1), timing());
                if (t === undefined) {
                    this.stack[this.stacksNumber[row]].shift();
                    this.put(data, row, i);
                    return;
                }
                t.onfinish = () => {
                    this.stack[this.stacksNumber[row]].shift();
                    this.put(data, row, i);
                };
            },
            push(row, element, data, i) {
                let c = [document.getElementsByName(0),
                    document.getElementsByName(1),
                    document.getElementsByName(2)];
                let td = document.getElementsByName(row)[0];
                td.classList.add('stack_unit');
                td.innerText = element;
                td.animate(newAnimation(), timing());
                let t;
                for (let i = 0; i < c.length; i++)
                    for (let j = 1; j < c[i].length; j++)
                        if (i !== row)
                            t = c[i][j].animate(hold(), timing());
                        else
                            t = c[i][j].animate(lowerAnimation(1), timing());
                t.onfinish = () => {
                    td.innerText = '';
                    td.classList.remove('stack_unit');
                    this.stack[this.stacksNumber[row]].unshift(element);
                    this.put(data, row, i + 1);
                };
            },
            put(data, row = 0, i = 1) {
                if (row >= 3)
                    return;
                let column = this.stacksNumber[row];
                let col = data[column];
                let newLen = col.length;
                let oldLen = this.stack[column].length;
                /*if (oldLen > newLen || this.stack[column][oldLen - i] !== col[newLen - i]) {
                    setTimeout(() => {
                        this.pop(row, data, i);
                    }, 100);
                }
                else */if (i <= newLen) {
                    if (this.stack[column][oldLen - i] === undefined || this.stack[column][oldLen - i] !== col[newLen - i]) {
                        setTimeout(() => {
                            this.push(row, col[newLen - i], data, i);
                        }, 100);
                    }
                }
                if (i > newLen)
                    this.put(data, row + 1);
            },
            start() {
                axios.post("simulation/start", {"code": this.code})
                    .then(response => {
                        this.stack = response.data.stack;
                        this.bytecodeLines = response.data.bytecodeLines;

                        this.visible = true;
                    });
            },
            current() {
                axios.put('simulation/current').then(response => {
                    this.stack = response.data.stack;
                    this.bytecodeLines = response.data.bytecodeLines;
                    if (response.data.status === 'FINISHED')
                        this.stop();

                });
            },
            advance() {
                axios.put('simulation/advance').then(response => this.put(response.data));
            },
            stop() {
                axios.delete('simulation').then(() => {
                    this.visible = false;
                });
            },
        }
        ,
        created() {
            //this.current();
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

    @keyframes new {
        from {
            transform: translateY(-35px);
            opacity: 0;
        }
        50% {
            opacity: 0;
        }
        to {
            transform: translateY(7px);
            opacity: 100%;
        }
    }

    @keyframes down {
        from {
            transform: translateY(-35px);

        }
        to {
            transform: translateY(7px);
        }
    }

    @keyframes up {
        from {
            transform: translateY(0px);
        }
        to {
            transform: translateY(-45px);
        }
    }

    @keyframes remove {
        from {
            transform: translateY(0px);
            opacity: 100%;
        }
        50% {
            opacity: 0%;
        }
        to {
            transform: translateY(-45px);
            opacity: 0%;
        }
    }

    .new {
        animation: new 500ms 1 ease-in;
    }

    .removing {
        animation: remove 500ms 1 ease-in;
    }

    .appearing {
        animation: down 500ms 1 ease-in;
    }

    .disappearing {
        animation: up 0.5s 1 ease-in;
    }

    .stack_unit {
        border: black 1px solid;
        height: 35px;
    }

    .stack {
        border-collapse: separate;
        height: auto;
        margin: auto;
        border-spacing: 1em 5px;
    }
</style>
