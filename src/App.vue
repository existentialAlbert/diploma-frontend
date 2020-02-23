<template>
    <div id="app">
        <Header></Header>
        <router-view></router-view>
    </div>
</template>
<script>
/*
    import Login from "@/components/Login";
    import Header from "@/components/Header"
    import Intro from "@/components/Intro"
*/
import Header from "@/components/Header.vue";
export default {
        name: 'App',
        components: {
            Header

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
    body{
    }
</style>
