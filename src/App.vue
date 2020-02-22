<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
/*    import Login from "@/components/Login";
    import Header from "@/components/Header"
    import Intro from "@/components/Intro"*/
    export default {
        name: 'App',
        components: {
       /*     Login,
            Header,
            Intro*/
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
