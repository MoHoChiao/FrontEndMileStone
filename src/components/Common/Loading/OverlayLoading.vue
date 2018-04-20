<template>
    <div v-if="new_isLoading" class="overlay">
        <div class="loader"></div>
        <div class="text">{{new_loadingText}}</div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            new_isLoading: false,
            new_loadingText: 'Loading'
        }
    },
    watch: {
        /*
         * 監視父元件的jarFiles值
         * 一旦更新時, 則立即把子元件中的new_isLoading及new_loadingText也一併更新
        */
        isLoading: function(newValue) {
            this.new_isLoading = newValue
        },
        loadingText: function(newValue) {
            this.new_loadingText = newValue
        }
    },
    props: {
        isLoading: {
            type: Boolean,
            default: false
        },
        loadingText: {
            type: String,
            default: 'Loading'
        }
    }
}
</script>
<style scoped>
    .overlay {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
        opacity: 1;
        transition: .5s ease;
        background-color: rgba(0,0,0,0.5);
    }
    .text {
        color: white;
        font-size: 36px;
        position: absolute;
        top: 60%;
        left: 55%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
    }
    .loader {
        border: 16px solid white;
        border-radius: 50%;
        border-top: 16px solid lightgrey;
        width: 160px;
        height: 160px;
        position: absolute;
        top: 30%;
        left: 50%;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
        text-align: center;
    }
/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>