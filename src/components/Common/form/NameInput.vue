<template>
    <input :value="value" @input="$emit('input', $event.target.value)" @keydown="keyhandler">
</template>

<script>
    export default {
        props: ['value'],
        methods: {
            keyhandler(event) {
                if (event.key == "/"
                    || event.key == "\\"
                    || event.key == " ") {
                    event.preventDefault();
                }
            }
        }
    }
</script>