<template>
    <table>
        <tr>
            <td v-if="currentPage > 2">
                <a @click="push(currentPage - 1)">
                    Назад
                </a>
            </td>
            <td v-if="currentPage > 1">
                <a @click="push(currentPage - 2)">
                    {{currentPage - 2}}
                </a>
            </td>
            <td v-if="currentPage > 0">
                <a style="color:yellow" @click="push(currentPage - 1)">
                    {{currentPage - 1}}
                </a>
            </td>
            <td>
                <label>{{currentPage}}</label>
            </td>
            <td v-if="amount - currentPage >= 1">
                <a @click="inc">
                    {{1 +currentPage}}
                </a>
            </td>
            <td v-if="amount - currentPage >= 2">
                <a @click="push(currentPage + 2)">
                    {{currentPage+2}}
                </a>
            </td>
            <td v-if="amount - currentPage > 2">
                <a href="" @click="push(currentPage+1)">
                    Далее
                </a>
            </td>
        </tr>
    </table>
</template>

<script>
    export default {
        name: "Pagination",
        props: ["amount", "url", "size"],
        data: function () {
            return {
                currentPage: Number(this.$route.params.page),
            }
        },
        methods: {
            inc() {
                this.$router.push(this.url + (this.currentPage+1)).then(()=>{
                });
            },
            push(pageNumber) {
                this.$router.push(this.url + pageNumber).then(() => {
                    alert()
                })
            }
        },
        created() {

        }
    }
</script>

<style scoped>

</style>
