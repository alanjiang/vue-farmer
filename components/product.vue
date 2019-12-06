<template>
    <div class="product" :style="{width:screenWidth>600 ? '25%' : '50%',height:screenWidth>600 ? '25%' : '50%'}">
    
        <router-link :info="info" :to="'/detail/' + info.id" class="product-main">
            
           <div class="image" >
           <img :src="info.image" width="150" height="150"> 
           
           </div>    
            <h4>{{ info.name }}</h4>
            
            <div class="product-cost">¥ {{ info.price }}</div>
           
             <div class="buy"><mt-button type="primary" size="small" style="cursor:pointer;" @click.prevent="addToCart(info.id,'')">去购买</mt-button></div>
           
            
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
                
                  screenWidth: document.body.clientWidth,
                  width:260,
                  height:260
            }
             
            
        },
        methods: {
               
                
                addToCart (idValue,symbolValue) {
               
                var products=[];
                
                if(localStorage.getItem("productList")!=null){
            	   products= JSON.parse(localStorage.getItem("productList"));
                }
                 
                var product=products.find(item => item.id == idValue);
               
                 console.log('<<<<product='+product);
                //调用main.js 
                //this.$store.commit('addCart', {id:idValue,symbol:symbolValue);
                 
                //调用myDialog.vue组件中的this.$bus.on('resetPopShow',..)事件
                this.$bus.emit('resetDialogShow',product);
                  
                 
            },
            getScreenWidth(){
            
               var width=document.body.clientWidth;
               
            },
            goBuy(idValue){
               
                 this.$router.push('/detail/'+idValue);
            },
            
            getImage2(maxWidth,maxHeight,src)
            {
                 this.$nextTick(function(){
                   var imgDiv=document.getElementById('imgDiv');
                   var img = new Image();
                   img.src = src;
                   var hRatio;
                   var wRatio;
                   var Ratio = 1;
                   var w = img.width;
                   var h = img.height;
                   wRatio = maxWidth / w;
                   hRatio = maxHeight / h;
              
                   if (maxWidth ==0 && maxHeight==0){
                      Ratio = 1;
                   }else if (maxWidth==0){//
                        if (hRatio<1) Ratio = hRatio;
                   }else if (maxHeight==0){  
                      if (wRatio<1) Ratio = wRatio;
                   }else if (wRatio<1 || hRatio<1){
                        Ratio = (wRatio<=hRatio?wRatio:hRatio);
                   }
                   if (Ratio<1){
                     w = w * Ratio;
                     h = h * Ratio;
                    }
              
                    var imgElement=document.createElement("img");
                    imgElement.setAttribute("src",src);
                    imgElement.setAttribute("width",w);
                    imgElement.setAttribute("height",h);
                    imgDiv.appendChild(imgElement);
                     
                 
                });
               
              console.log('width='+this.width+','+this.height);
           },
           
           getImage(maxWidth,maxHeight,src)
            {
                
                var img = new Image();
                img.src = src;
                var hRatio;
                var wRatio;
                var Ratio = 1;
                var w = img.width;
                var h = img.height;
                wRatio = maxWidth / w;
                hRatio = maxHeight / h;
              
               if (maxWidth ==0 && maxHeight==0){
                   Ratio = 1;
               }else if (maxWidth==0){//
                   if (hRatio<1) Ratio = hRatio;
               }else if (maxHeight==0){  
                   if (wRatio<1) Ratio = wRatio;
                   }else if (wRatio<1 || hRatio<1){
                    Ratio = (wRatio<=hRatio?wRatio:hRatio);
                   }
              if (Ratio<1){
                w = w * Ratio;
                h = h * Ratio;
              }
              this.width=w;
              this.height=h;
              console.log('width='+this.width+','+this.height);
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
        margin: 3px;
        padding:5px;
        border: 1px solid #dddee1;
        border-radius: 6px;
        overflow: hidden;
        background: #fff;
        text-align: center;
        position: relative;
    }
    .product-main .image{
        max-width:280px;
        max-height:280px;
        overflow:hidden;
        cursor:pointer;
        position: relative;
    }
    h4{
     font-size: 12px;
	 color: #000;
	 height:20px;
	 overflow:hidden;
	 margin-top:2px;
	 margin-bottom:2px;
        
    }
    .buy{
      
       height:30px;
    
    }
    a { text-decoration:none; }
    .product-main:hover h4{
        color: #0070c9;
    }
    
    .product-cost{
        color: #de4037;
        margin-top: 1px;
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