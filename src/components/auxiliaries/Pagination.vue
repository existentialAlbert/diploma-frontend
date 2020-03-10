<template>
    <table>
        <tr>
            <td v-if="currentPage > 2">
                <a href="" @click="currentPage--">
                    Назад
                </a>
            </td>
            <td v-if="currentPage > 1">
                <a href="" @click="currentPage-=2">
                    {{currentPage - 2}}
                </a>
            </td>
            <td v-if="currentPage > 0">
                <a href="" @click="currentPage--">
                    {{currentPage - 1}}
                </a>
            </td>
            <td>
                <label style="color:yellow">{{currentPage}}</label>
            </td>
            <td v-if="amount - currentPage > 0">
                <a href="" @click="currentPage++">
                    {{1 + currentPage}}
                </a>
            </td>
            <td v-if="amount - currentPage > 1">
                <a href="" @click="currentPage += 2">
                    {{currentPage+2}}
                </a>
            </td>
            <td v-if="amount - currentPage > 2">
                <a href="" @click="currentPage++">
                    Далее
                </a>
            </td>
        </tr>
    </table>
</template>

<script>
    export default {
        name: "Pagination",
        props: ["amount", "url"],
        data: function () {
            return {
                currentPage: Number(this.$route.params.page),
            }
        },
        watch: {
            currentPage(val) {
                this.$router.push({path: this.url + "" + val});
            },
        },
    }
</script>

<style scoped>

</style>
