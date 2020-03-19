<template>
    <nav>
        <br>
        <ul class="pagination justify-content-center">
            <li class="page-item" v-if="currentPage > 2">
                <a class="page-link" href="" @click="currentPage--">
                    Назад
                </a>
            </li>
            <li class="page-item" v-if="currentPage > 1">
                <a class="page-link" href="" @click="currentPage-=2">
                    {{currentPage - 2}}
                </a>
            </li>
            <li class="page-item" v-if="currentPage > 0">
                <a class="page-link" href="" @click="currentPage--">
                    {{currentPage - 1}}
                </a>
            </li>
            <li class="page-item-active">
                <a class="page-link">{{currentPage}}</a>
            </li>
            <li class="page-item" v-if="amount - currentPage > 0">
                <a class="page-link" href="" @click="currentPage++">
                    {{1 + currentPage}}
                </a>
            </li>
            <li class="page-item" v-if="amount - currentPage > 1">
                <a class="page-link" href="" @click="currentPage += 2">
                    {{currentPage+2}}
                </a>
            </li>
            <li class="page-item" v-if="amount - currentPage > 2">
                <a class="page-link" href="" @click="currentPage++">
                    Далее
                </a>
            </li>
        </ul>
    </nav>
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
                this.$router.push(this.url + "" + val);
            },
        },
    }
</script>

<style scoped>

</style>
