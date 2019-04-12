<template>
    <div class="product" :style="{width:screenWidth>600 ? '25%' : '50%'}">
        <router-link :info="info" :to="'/detail/' + info.id" class="product-main">

            <img  v-lazy="info.image">
            <h4>{{ info.name }}</h4>
            <div class="product-color" :style="{ background: colors[info.color]}"></div>
            <div class="product-cost">¥ {{ info.cost }}</div>
            <div class="product-add-cart" @click.prevent="addToCart(info.id)">加入购物车</div>
        </router-link>
    </div>
</template>
<script>


import { Toast } from 'mint-ui';

    export default {
        props: {
            info: {id:1, name:'',cost:0, image:''}
        },
        data () {
             return {
                colors: {
                    '白色': '#ffffff',
                    '金色': '#dac272',
                    '蓝色': '#233472',
                    '红色': '#f2352e'
                },
                  screenWidth: document.body.clientWidth
                  
            }
             
            
        },
        methods: {
            addToCart (id) {
               
                this.$store.commit('addCart', id);
                Toast({
                     message: '操作成功',
                     iconClass: 'icon icon-success'
                  });
                  
                  this.$bus.emit('resetPopShow','hello world');
                 
            },
            getScreenWidth(){
            
               var width=document.body.clientWidth;
               alert('screen width='+width);
            }
        }
        
       
    };
</script>
<style scoped>


.product{
        
        float: left;
    }
    .product-main{
        display: block;
        margin: 16px;
        padding: 16px;
        border: 1px solid #dddee1;
        border-radius: 6px;
        overflow: hidden;
        background: #fff;
        text-align: center;
        position: relative;
    }
    .product-main img{
        width: 100%;
        cursor:pointer;
    }
    h4{
     font-size: 14px;
	 color: #000;
	 height:50px;
	 overflow:hidden;
        
    }
    a { text-decoration:none; }
    .product-main:hover h4{
        color: #0070c9;
    }
    .product-color{
        display: block;
        width: 16px;
        height: 16px;
        border: 1px solid #dddee1;
        border-radius: 50%;
        margin: 6px auto;
    }
    .product-cost{
        color: #de4037;
        margin-top: 6px;
    }
    .product-add-cart{
        display: none;
        padding: 4px 8px;
        background: #2d8cf0;
        color: #fff;
        font-size: 12px;
        border-radius: 3px;
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: 5px;
    }
    .product-main:hover .product-add-cart{
        display: inline-block;
    }

</style>