<template>
    <div id="app">
        <Header></Header>
        <transition>
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
import Header from "@/components/auxiliaries/Header.vue";
export default {
        name: 'App',
        components: {
            Header
        },
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
