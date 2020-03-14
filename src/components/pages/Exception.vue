<template>
    <div>
        <details>
            <summary><h2>Stack trace:</h2>
            </summary>
            <pre>
        {{info.stackTrace}}
    </pre>
        </details>
    </div>
</template>

<script>
    const axios = require('axios').default;
    export default {
        name: "Exception",
        data() {
            return {
                info: {},
            }
        },
        created() {
            axios(`errors/${this.$route.params.code}`).then(response => {
                this.info = response.data;
            })
        },
    }
</script>

<style scoped>
    pre {
        text-align: left;
        padding-left: 25%;
        padding-right: 25%;
    }
</style>
