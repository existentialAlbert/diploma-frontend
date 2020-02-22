<template>
    <div>
        <form>
            <label>
                Введите свой никнейм:<br/>
                <input type="text" maxlength="25"/>
                <br/>
                Введите пароль:<br/>
                <input type="password" maxlength="40">
                <br/>
                Введите пароль еще раз:<br/>
                <input type="password" maxlength="40">
            </label>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Registration",
        components: {

        }
    }
</script>

<style scoped>
    * {
        margin: auto;
    }
</style>
