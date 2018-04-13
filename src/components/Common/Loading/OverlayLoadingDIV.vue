<template>
    <div>
        <div class="content">
            <slot name="content"></slot>
        </div>
        <div class="overlay" v-if="isLoading">
            <div class="loader"></div>
            <div class="text">{{loadingText}}</div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isLoading: false,
            loadingText: ''
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
        font-size: 20px;
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
        width: 80px;
        height: 80px;
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