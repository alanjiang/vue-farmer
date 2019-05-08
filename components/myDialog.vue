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
                   <p>{{product.price}}</p>
                   <p>库存：2300</p>
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
       <div class="cart-price">单价: {{product.price}}  &nbsp; 总价:{{total_price }} </div>
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
                
                <div  class="confirm-btn" @click="confirmBtn">
                    加入购物车
                </div>
 </div>
  <div class="close-btn" @click="closeMask"><img src="../images/close.png"></div>
          
        
  </div>
        
 </div>
 
</template>
<script>


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
            product:null
        }
    },
    methods:{
    
        addNum(){
           this.count++;
        },
        subNum(){
          if(this.count==1){
            return;
          }
          this.count--;
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
        confirmBtn(){
            //this.$emit('confirm');
            this.closeMask();
        },
        
        //选取规格，及时调整单价、总价和库存,规格一维点击了
        chooseItem1(index,attr_id){
           this.attr_id1=attr_id;
           alert('attr_id='+this.attr_id1);
           this.selected1=index;
           
          if(this.product.attrs.length == 1){
              
              
          } 
        
        },
        
        //规格二维点击了
        chooseItem2(index,attr_id){
         this.attr_id2=attr_id;
         alert('attr_id='+this.attr_id2);
         this.selected2=index;
         var target=this.product.mer_attr_price.find(item=> {
             var s1=this.attr_id1+','+this.attr_id2;
             var s2=this.attr_id2+','+this.attr_id1;
             alert('-s1='+s1+',s2='+s2+',symbol='+item.symbol);
             if( s1 === item.symbol  || s2 === item.symbol){
                  alert('--get it!');
                  return true;
             }
           
         });
         
         alert('--get it='+target.symbol);
      },
      sayHello(){
      
       alert("sayHello");
      
      }
    },
    

    
    mounted(){
       
    },
     created(){
     //组件传值:resetDialogShow is event from product.vue $emit 
     this.$bus.on('resetDialogShow', (val) => {
         
          this.showMask=true;
          this.product=val;
          this.price=product.price;
          console.log("myDialog>>>>>product="+this.product.image);
         
     });
  
  },
    
    
    watch:{
       showMask(newVal, oldVal){
            
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
        padding:0px 5px;
        width: 45%;
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
        line-height: 22px;
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
