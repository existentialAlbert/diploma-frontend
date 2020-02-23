<template>
    <div>{{token}}</div>
</template>

<script>
    export default {
        name: "Progress",
        data: function () {
            return {
                token: localStorage.getItem("token"),
            }
        }
    }
</script>

<style scoped>

</style>
