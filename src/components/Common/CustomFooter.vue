<template>
    <footer class="w3-container w3-camo-black w3-small" style="">
        <p>
            <select class="w3-right w3-camo-black" @change="setLocale">
                <option v-for="locale in localeAry" :value="locale.value" :selected="locale.value == $i18n.locale">{{ locale.name }}</option>
            </select>
            <div class="w3-center w3-margin-left">
                Copyright © Trinity Data Corporation
            </div>
        </p>
    </footer>
</template>

<script>
    export default {
        data() {
            return {
                localeAry: [
                    { name: 'English', value: 'en_US' },
                    { name: 'Traditional Chinese', value: 'zh_TW' },
                    { name: 'Simplified Chinese', value: 'zh_CN' }
                ]
            }
        },
        methods: {
            setLocale(item) {
                //console.log(item.target.value)
                this.$i18n.locale = item.target.value
            }
        }
    }
</script>