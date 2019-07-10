<template>
  <div class="dialog" v-show="showMask">
    <div class="dialog-container">
         <div class="dialog-title">商品挑选</div>
         <div class="content">
         
           <div class="product-content-main">
                <div class="product-image">
  
                  <img :src="product.image">
  
                </div>
            
            <div class="product-info">
                   <p>{{product.name}}</p>
                   <p style="size:16px;color:red;" v-if="price_span == null">¥{{this.price}}</p>
                   <p style="size:16px;color:red;" v-else>¥{{price_span}}</p>
                   <p v-show="remain !=null">库存：{{remain}}</p>
            </div>
            
         </div> <!-- end of product-content-main -->
         
         
  <div v-for="(attr,index1) in product.attrs">
  
      <p class="title">{{attr.attr_key}}</p>
     
  <ul>
  <li v-for="(item,index) in attr.attr_values" class="label" 
   :class="{label_active: index1 == 0 ? selected1 == index : selected2 == index}"  @click="index1 == 0 ? chooseItem1(index,item.attr_id):chooseItem2(index,item.attr_id)" >
      {{ item.attr_value }}  
  </li> 
  </ul>
     
     
   <div class="clear"></div>
      
   
  </div>
          
 
   <div class="cart-content-main">
     <div class="cart-count">
         数量
                    <span class="cart-control-minus" @click="subNum()">-</span>
                    <font color="red">{{count}}</font>
                    <span class="cart-control-add" @click="addNum()">+</span>
      </div>
       <div class="cart-price">单价: <font color="red">¥{{this.price}}</font>  &nbsp; 总价:<font color="red">¥{{total_price  }}</font> </div>
   </div>
 
  
  
  <!--
  <mt-button type="primary" size="normal" @click="sayHello">SayHello</mt-button>
  -->    
            
    <!-- end of content -->
            
            
             
 </div>
            
            
            
            
 <div class="btns">
                <div  class="default-btn" @click="closeBtn">
                    不买了
                </div>
                
                <div  class="confirm-btn" @click="addToCart()">
                    加入购物车
                </div>
 </div>
  <div class="close-btn" @click="closeMask"><img src="../images/close.png"></div>
          
        
  </div>
        
 </div>
 
</template>
<script>

import { Toast } from 'mint-ui';
export default {
  name:'MyDialog',
     
    props: {
        
       
    },
    data(){
        return{
            showMask: false,
            selected1:-1,
            selected2:-1,
            attr_id1:null,
            attr_id2:null,
            count:1,
            price:0,
            total_price:0,
            remain:null,
            product:null,
            symbol:'',
            price_span:null
            
        }
    },
    methods:{
        getTotalPrice(){
        
           return  this.count*this.price;
        },
        addNum(){
        
           if(!this.judgeAttrComplete()){
            return;
           }
           if(this.remain !=null ){
              if(this.count >= this.remain){
                 this.count==this.remain;
              }
           }
           this.count++;
           this.total_price=this.price*this.count;
           
        },
        subNum(){
          
          if(this.count==1){
            return;
          }
          if(!this.judgeAttrComplete()){
            return;
          }
          this.count--;
          this.total_price=this.price*this.count;
        },
        closeMask(){
            this.showMask = false;
        },
        closeBtn(){
            //this.$emit('cancel');
            this.closeMask();
        },
        dangerBtn(){
            //this.$emit('danger');
            this.closeMask();
        },
        
        judgeAttrComplete(){
             if(this.product.attrs.length == 2 ){
               if(this.attr_id1 ==null  || this.attr_id2 == null){
                alert('规格没有全面选择');
                return false;
               }
            }
            if(this.product.attrs.length == 1){
                if(this.attr_id1 ==null){
                 alert('规格没有选择');
                return false;
               }
            }
            return true;
        },
        addToCart(){
            
            
             if(!this.judgeAttrComplete()){
                return;
             }
             
             
             var params={'id':this.product.id,'symbol':this.symbol,'count':this.count};
             this.closeMask();
             //调用main.js中的函数
             
             this.$store.commit('addCart', params);
             
             //调用cart.vue组件中的this.$bus.on('cartChange',..)事件
             this.$bus.emit('cartChange',params);
          
        },
        //规格有二维时，点击不分先后
        //选取规格，及时调整单价、总价和库存,规格一维点击了
        chooseItem1(index,attr_id){
           this.attr_id1=attr_id;
           this.selected1=index;
           
          if(this.product.attrs.length == 2){
            //二维已经选择了，需要计算价格,修复当用户先选择二维再选择一维时价格不变的BUG
             if(this.attr_id2 != null ){
                 var target=this.product.mer_attr_price.find(item=> {
                 var s1=this.attr_id1+','+this.attr_id2;
                 var s2=this.attr_id2+','+this.attr_id1;
                 if( s1 == item.symbol  || s2 == item.symbol){
                     return true;
                  }});
                  if(target != null){
                     this.price=target.price;
                     this.remain=target.num;
                     this.symbol=target.symbol;
                 }
             }
             
              
          } 
          if(this.product.attrs.length == 1){
              
             
             var target=this.product.mer_attr_price.find(item=> {
            
               if( attr_id == item.symbol ){
                  return true;
                }
            });
             
             if(target != null){
                  this.price=target.price;
                  this.remain=target.num;
                  this.symbol=target.symbol;
             }
             
             
          } 
          
           this.total_price=this.price*this.count;
        
        },
        
        //规格二维点击了
        chooseItem2(index,attr_id){ 
         this.attr_id2=attr_id;
         this.selected2=index;
         if(this.attr_id1 == null ) return;
         var target=this.product.mer_attr_price.find(item=> {
             var s1=this.attr_id1+','+this.attr_id2;
             var s2=this.attr_id2+','+this.attr_id1;
             if( s1 == item.symbol  || s2 == item.symbol){
                 
                  return true;
             }});
        if(target !=null ){
           this.price=target.price;
           this.remain=target.num;
           this.symbol=target.symbol;
         }  
         
         this.total_price=this.price*this.count;
        
      }
    },
    

    
    mounted(){
       
       
    },
     created(){
     //组件传值:resetDialogShow 监听来自product.vue $emit发出的事件
     this.$bus.on('resetDialogShow', (val) => {
         
          this.showMask=true;
          this.product=val;
          this.price=this.product.price;
          this.total_price=this.product.price*this.count;
          this.count=1;
          this.price_span=null;
          this.attr_id1=null;
          this.attr_id2=null;
          this.selected1=-1;
          this.selected2=-1;
          
          if(val.mer_attr_price.length >0 ){
                if(val.mer_attr_price.length==1) {
                   this.price_span=val.mer_attr_price[0]['price'];
                   return false;
                }
                val.mer_attr_price.sort(function(a,b){
                   if(a['price']<b['price']){
                       return -1;
                   }
                   if(a['price']>b['price']){
                    return 1;
                  }
                  return 0;
               });
               if(val.mer_attr_price[0]['price'] == val.mer_attr_price[val.mer_attr_price.length-1]['price']){
                  this.price_span=val.mer_attr_price[0]['price'];
               }else{
                 this.price_span=val.mer_attr_price[0]['price']+'-'+val.mer_attr_price[val.mer_attr_price.length-1]['price'];
               }
               
               
          }else{
          
             this.price=val.price;
             this.price_span=null;
             
          }
          
         
     });
  
  },
    
    
    watch:{
       total_price(newVal, oldVal){
            
            //alert(newVal+","-oldVal);
        }
    }
}
</script>
<style lang="less" scoped>
    .dialog{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9999;
        .dialog-container{
            width:  100%;
            height: 80%;
            background: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            overflow:auto;
            transform: translate(-50%, -50%);
            border-radius: 8px;
            position: relative;
            .dialog-title{
                width: 100%;
                height: 60px;
                font-size: 18px;
                color: #696969;
                font-weight: 600;
                padding: 16px 50px 0 20px;
                box-sizing: border-box;
            }
            .content{
                color: #797979;
                width:100%;
                overflow:auto;
                padding: 0 5px;
                box-sizing: border-box;
            }
            .inp{
                margin: 10px 0 0 20px;
                width: 200px;
                height: 40px;
                padding-left: 4px;
                border-radius: 4px;
                border: none;
                background: #efefef;
                outline: none;
                &:focus{
                    border: 1px solid #509EE3;
                }
            }
            .btns{
                width: 100%;
                height: 60px;
                position: relative;
                bottom: 0;
                left: 0;
                text-align: right;
                padding: 0 16px;
                box-sizing: border-box;
                & > div{
                    display: inline-block;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 14px;
                    color: #ffffff;
                    background: #f1f1f1;
                    border-radius: 8px;
                    margin-right: 12px;
                    cursor: pointer;
                }
                .default-btn{
                    color: #787878;
                    &:hover{
                        color: #509EE3; 
                        border:1px solid #1E90FF;
                    }
                }
                .danger-btn{
                    background: #EF8C8C;
                    &:hover{
                        background: rgb(224, 135, 135);
                    }
                    &:active{
                        background: #EF8C8C;
                    }
                }
                .confirm-btn{
                    color: #ffffff;
                    background: #509EE3;
                    &:hover{
                        background: #6FB0EB;
                    }
                }
            }
            .close-btn{
                position: absolute;
                top: 16px;
                right: 16px;
                width: 30px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                font-size: 18px;
                cursor: pointer;
                &:hover{
                    font-weight: 600;
                }
            }
        }
    }
    
    
    
p
{
 color:#000;
 height:20px;
 
}
.title{
  
  text-align:left;
  
  font-size:12px;
  
  

}
ul{
  padding:2px 2px;
}
li {
  
   width:90px;
   height:20px;
   padding:2px 2px;
   text-align:center;
   float:left;
   list-style:none;
   margin:1px 1px;
   
   font-size:12px;
   
   cursor:pointer;

}

li:hover{
   border:1px solid red;
}
 .label{
    
    border-radius:8px;
    color:#000;
    background:#fff;
 }
 
 .label_active{
     color:red;
     border-radius:8px;
     border:1px solid red;
     background:#fff;
 }

.clear{

   width:100%;
   height:1px;
   background:#fff;
   display:block;
   clear:both;
}
.product-content-main{
       
        padding: 6px 3px;
        text-align: left;
        border-bottom: 1px dashed #e9eaec;
        overflow: hidden;
 }
 .product-content-main div{
        float: left;
 }

.product-image{

   width:40%;
   
   height:30%;
   
   background:#fff;
   
   text-align:left;
  
}

.product-image  img{
  max-width:40%;
  max-height:30%;

}
.product-info{

   width:55%;
   
   height:30%;
   
   

}

.product-info p{
   padding:2px 2px;
   height:20p;
   border-bottom:1px dashed #e9eaec;
   text-align:left;
   font-size:12px;
   color:#4A4A4A;
}

 .cart-content-main{
       
        padding: 6px 3px;
        text-align: left;
        border-bottom: 1px dashed #e9eaec;
        overflow: hidden;
  }
    .cart-content-main div{
        float: left;
    }

 .cart-count{
        padding:2px 5px;
        width: 45%;
        height:35px;
        overflow:hidden;
        text-align:left;
        color:#4A4A4A;
        font-size:12px;
    }
    
   
   .cart-control-minus,.cart-control-add{
        display: inline-block;
        margin: 0 4px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background: #FA8072;
        border-radius: 50%;
        box-shadow: 0 1px 1px rgba(0,0,0,.6);
        cursor: pointer;
    }  
    
    .cart-price{
        width: 50%;
        overflow:hidden;
        text-align:left;
        color:#4A4A4A;
    } 
</style>
