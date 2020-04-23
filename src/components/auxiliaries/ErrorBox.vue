<template>
    <div v-if="isActive">
        <div class="container alert alert-warning border shadow-sm" role="alert">
            <div v-for="i of errors" v-bind:key="i">{{i}}<br></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ErrorBox",
        props: ["errors"],
        computed: {
            isActive() {
                return this.errors.length !== 0;
            }
        }

    }
</script>

<style scoped>
</style>
