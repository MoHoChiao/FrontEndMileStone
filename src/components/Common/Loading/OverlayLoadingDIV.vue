<template>
    <div>
        <div class="content">
            <slot name="content"></slot>
        </div>
        <div class="overlay" v-if="new_isLoading">
            <div class="loader" :style="'width:' + loadingSize+ ';height:' + loadingSize"></div>
            <div class="text" :style="'font-size:' +  textSize">{{new_loadingText}}</div>
        </div>
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
        },
        loadingSize: {
            type: String,
            default: '80px'
        },
        textSize: {
            type: String,
            default: '20px'
        }
    }
}
</script>
<style scoped>
    .content {
        display: block;
        width: 100%;
        height: auto;
    }
    .overlay {
        position: absolute;
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
        position: absolute;
        top: 70%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
    }
    .loader {
        border: 16px solid white;
        border-radius: 50%;
        border-top: 16px solid lightgrey;
        position: absolute;
        top: 20%;
        left: 45%;
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