<template>
    <div class="main">
        <div @click="openMask">打开弹窗</div>
        <dialog-bar v-model="sendVal" 
        type="danger" 
        title="我是标题" 
        :content="content" 
        v-on:cancel="clickCancel()" 
        @danger="clickDanger()" 
        @confirm="clickConfirm()" 
        dangerText="Delete"> 
        </dialog-bar>
    </div>
</template>
<script>
import dialogBar from '../components/dialog.vue'
export default {
   components:{
        'dialog-bar': dialogBar,
    },
    data(){
        return{
            sendVal: false,
            content:'<p><img src="../images/c10.jpg"></p><p><img src="../images/c10.jpg"></p><p><img src="../images/c10.jpg"></p>'
        }
    },
    methods:{
        openMask(index){
            this.sendVal = true;
        },
        clickCancel(){
            alert('点击了取消');
        },
        clickDanger(){
            alert('这里是danger回调')
        },
        clickConfirm(){
            alert('点击了confirm');
        }
    }
}
</script>
<style lang="less" scoped>

</style>

