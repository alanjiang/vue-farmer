<template>
    <div class="product" :style="{width:screenWidth>600 ? '25%' : '50%'}">
    
        <router-link :info="info" :to="'/detail/' + info.id" class="product-main">
            <img  v-lazy="info.image">
       
            <h4>{{ info.name }}</h4>
            
            
            <div class="product-cost">¥ {{ info.price }}</div>
            <h4><mt-button type="primary" size="small" style="cursor:pointer;" @click.prevent="goBuy(info.id)">去购买</mt-button></h4>
            
       </router-link> 
    </div>
</template>
<script>


import { Toast,Button } from 'mint-ui';

    export default {
        props: {
            info: {id:1, name:'',price:0, image:'',symbol:'',label:'',num:0}
        },
        data () {
             return {
                
                  screenWidth: document.body.clientWidth
                  
            }
             
            
        },
        methods: {
        
                addToCart (idValue,symbolValue) {
                var products=[];
                
                if(localStorage.getItem("productList")!=null){
            	   products= JSON.parse(localStorage.getItem("productList"));
                }
                
                //商品的基础信息:
                var product=products.find(item => item.id == idValue);
                //调用main.js 
                //this.$store.commit('addCart', {id:idValue,symbol:symbolValue);
                 
                  //调用this.$bus.on('resetPopShow',..)事件，组件间相互通讯。
                this.$bus.emit('resetPopShow',product);
                  
                  
                 
            },
            getScreenWidth(){
            
               var width=document.body.clientWidth;
               alert('screen width='+width);
            },
            goBuy(idValue){
               
                 this.$router.push('/detail/'+idValue);
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
        margin: 5px;
        padding: 5px;
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
	 height:30px;
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