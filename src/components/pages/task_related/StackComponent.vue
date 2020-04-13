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
        <button @click="advance">Следующий шаг</button>
        <div>
            <table class="stack">
                <tr>
                    <td id="description" :rowspan="rows.length + 3">
                        <label v-for="line in bytecodeLines" :key="line">
                            {{line}}
                        </label>
                    </td>
                </tr>
                <!-- <tr>
                     <td align="left">Локальные переменные
                         <label align="left" v-for="variable in stack.localVariables" :key="variable"><strong>{{variable.typeName}}:</strong> {{variable.value}}</label></td>
                 </tr>-->
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
    function getDownAnimation(amount) {
        return [{transform: `translateY(-${35 * amount}px)`},
            {transform: `translateY(${7 * amount}px)`}]
    }

    function getUpAnimation(amount) {
        return [{transform: `translateY(-${0}px)`},
            {transform: `translateY(${-45* amount}px)`}]
    }
    function appearAnimation() {

    }
    const axios = require('axios').default;
    export default {
        name: "StackComponent",
        data() {
            return {
                bytecodeLines: [],
                visible: false,
                stack_unit: "stack_unit",
                appearing: "appearing stack_unit",
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
            pop(row) {
                let td = document.getElementsByName(row)[1];
                td.addEventListener('animationend', this.end2, false,);
                td.classList.add('removing');
                localStorage.setItem('row', row);
                document.getElementsByName(row).forEach(el => {
                    if (!el.classList.contains('removing'))
                        el.classList.add('disappearing');
                });
            },
            push(row, el) {
                let td = document.getElementsByName(row)[0];
                td.innerHTML = `<label>${el}</label>`;
                td.classList.add('stack_unit');
                td.addEventListener('animationend', this.end, false);
                td.classList.add('new');
                localStorage.setItem('row', row);
                document.getElementsByName(row).forEach(el => {
                    if (!el.classList.contains('new'))
                        el.classList.add('appearing');
                });
            },
            end() {
                let row = localStorage.getItem('row');
                let td = document.getElementsByName(row)[0];
                //.let el = td.innerHTML;
                td.classList.remove('stack_unit');
                td.classList.remove('new');
                document.getElementsByName(row).forEach(el =>
                    el.classList.remove('appearing'));
                td.removeEventListener('animationend', this.end, false);
                td.innerHTML = '';
                this.stack[this.stacksNumber[row]].unshift(this.newStack[this.stacksNumber[row]][0]);
                if (this.newStack[this.stacksNumber[row]] !== this.stack[this.stacksNumber[row]])
                    this.push(row, this.newStack[this.stacksNumber[row]].shift());
            },
            end2() {
                let row = localStorage.getItem('row');
                let td = document.getElementsByName(row)[1];
                td.classList.remove('stack_unit');
                td.classList.remove('removing');
                document.getElementsByName(row).forEach(el =>
                    el.classList.remove('disappearing'));
                td.removeEventListener('animationend', this.end2, false);
                td.innerHTML = '';
                this.stack[this.stacksNumber[row]].shift();
                if (this.newStack[this.stacksNumber[row]] !== this.stack[this.stacksNumber[row]])
                    this.pop(row);
            },
            put(data) {
                let newStack = data.stack;
                this.newStack = newStack;
                let a = 0;
                for (let column in newStack) {
                    setTimeout(() => {
                        if (newStack[column].length > this.stack[column].length) {
                            console.log(this.stack[column].length + " " + newStack[column].length);
                            this.push(a, newStack[column].shift());
                        }
                        if (newStack[column].length < this.stack[column].length) {
                            console.log(this.stack[column].length + " " + newStack[column].length);
                            this.pop(a);
                        }
                        a++;
                    }, 1000);
                }
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
