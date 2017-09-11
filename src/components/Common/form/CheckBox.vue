<template>
    <div class="w3-row w3-section">
        <div class="w3-col w3-text-black">
            <input class="w3-check" type="checkbox" :checked="checked" @click="check">&nbsp;<slot></slot>
        </div>
    </div>
</template>
<script>
export default {
   data() {
        return {
            checked: ''
        }
    },
   methods: {
        check() {
            if(this.checked === '')
                this.checked = 'checked'
            else
                this.checked = ''
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