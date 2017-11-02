<template>
    <div>
        <i v-if="checked" class="fa fa-check-square-o" title="Select All" aria-hidden="true" @click="check"></i>
        <i v-else class="fa fa-square-o" title="Deselect All" aria-hidden="true" @click="check"></i>
    </div>
</template>
<script>
export default {
   data() {
        return {
            checked: false
        }
    },
   methods: {
        check() {
            this.checked = !this.checked
        }
   }
}
</script>
<style scoped>
@media (max-width: 34em) {
    div {
        font-size: 0.75em;
        font-size: 3.5vw;
    }
}
</style>