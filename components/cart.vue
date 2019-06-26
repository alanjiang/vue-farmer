<template>
    <div class="cart">
    
        <div class="cart-header" v-show="cartList.length > 0">
            <div class="cart-header-title">购物清单</div>
            <div class="cart-header-main">
                <div class="cart-info">商品信息</div>
                <div class="cart-price">单价</div>
                <div class="cart-count">数量</div>
                <div class="cart-cost">小计</div>
                <div class="cart-delete">删除</div>
            </div>
        </div>
        <div class="cart-content">
            <div class="cart-content-main" v-for="(item, index) in cartList">
                <div class="cart-info">
                    <img :src="item.image">
                    
                </div>
                
                
                <div class="cart-price">¥ {{ item.price }}</div>
                <div class="cart-count">
                    <span class="cart-control-minus" @click="subMer(item.id,item.symbol)">-</span>
                    {{ item.count }}
                    <span class="cart-control-add" @click="addMer(item.id,item.symbol)">+</span>
                </div>
                <div class="cart-cost">¥ {{ item.price * item.count }}</div>
                <div class="cart-delete">
                    <span class="cart-control-delete" @click="delMer(item.id,item.symbol)">删除</span>
                </div>
                
                <div class="cart-extend">{{ item.name }} &nbsp;{{ item.label}}</div>
                
            
            </div>
            <div class="cart-empty" v-if="cartList.length == 0">
            
             <img src="../images/cart.png" > <br>
            亲，购物车饿瘪啦！
            
            </div>
        </div>
        
        
        <div class="cart-footer" v-show="cartList.length">
            <div class="cart-footer-desc">
                共计 <span>{{ countAll }}</span> 件商品
            </div>
            <div class="cart-footer-desc">
                应付总额 <span>¥ {{ costAll - promotion }}</span>
                <br>
                <template v-if="promotion">
                    （优惠 <span>¥ {{ promotion }}</span>）
                </template>
            </div>
            <div class="cart-footer-desc">
                <div class="cart-control-order" @click="handleOrder">现在结算</div>
            </div>
        </div>
    </div>
</template>
<script>
    import { Navbar, Toast,Indicator } from 'mint-ui';
    import $ from 'jquery';
    import constants from '../utils/constants.js';
    export default {
      data () {
            return {
               
                promotionCode: '',
                promotion: 0,
               
                cartList: this.calCartList (),
                
                member: null,
                
                domain: constants.domain
                
            }
        },
        computed: {
            countAll () {
                let count = 0;
                this.cartList.forEach(item => {
                    count += item.count;
                });
                return count;
            },
            costAll () {
                let cost = 0;
                this.cartList.forEach(item => {
                    cost += item.price * item.count;
                });
                //return cost.toString().replace(/\B(?=(\d{3})+$)/g,',');
                return cost.toFixed(2);
            }
        },
       
        methods: {
               calCartList () {
                
                 if(localStorage.getItem("cartList")!=null){
                  
                   return JSON.parse(localStorage.getItem("cartList"));
                }
                  alert('--cartList='+localStorage.getItem("cartList"));
                  return [];
                
              },
               //调用 main.js中mutations 中的方法，传实参
                subMer(idValue, symbolValue) {
                 
                this.cartList.find(item => { 
                     if(idValue == item.id && symbolValue == item.symbol){
                         item.count=item.count-1;
                         if(item.count <=0 ){
                           item.count=1;
                         }
                         
                          this.$store.commit('editCartCount',item);
                          
                     }
                });
                this.resetCartList();
            },
            addMer (idValue, symbolValue) {
            
 
                this.cartList.find(item => { 
                     if(idValue == item.id && symbolValue == item.symbol)
                     {
                          item.count=item.count+1;
                          if(item.count > item.num){
                           Toast({
                               message: '超出最大库存:'+item.num,
                               iconClass: 'icon icon-success'
                              });
                            item.count=item.num;
                          }
                          
                          
                         this.$store.commit('editCartCount',{id:item.id,symbol:item.symbol,count:item.count});
                         this.resetCartList();
                      }
                });
                
            },
            delMer (idValue,symbolValue) {
                
                this.$store.commit('deleteCart', {id:idValue,symbol:symbolValue});
                 this.resetCartList();
            },
            
            
              resetCartList(){
             
            
              this.cartList=JSON.parse(localStorage.getItem("cartList"));
            
            },
            
            handleOrder () {
                
                 if(this.member ==null){
                 
                    Toast({
  	    		    message: '下单之前需要会员认证!',
  	    		    position: 'middle',
  	    		    duration: 1000
  	    	     }); 
  	    	       //调用主组件FootBar中的showTab
  	    	        this.$bus.emit('showTab','我的');
  	    	        //调用主组件my.vue中的wechatShow
  	    	        this.$bus.emit('wechatShow','会员资料');
                 }else
                 {
                 
                     this.makeOrder();
                       
                 }
                
        },
        
        makeOrder(){
        
         var obj={};
         obj.mers=this.cartList;
         var jsondata=JSON.stringify(obj);
         Indicator.open({
             text: '订单生成中...',
             spinnerType: 'fading-circle'
          });
		 var __this=this;
         $.ajax({
           type:"POST",
           contentType: "application/json; charset=utf-8",
           url:__this.domain+"/newsales/makeOrder",
           data:jsondata,
           datatype: "json",
           success: function (message) 
		   {
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			  
			   Indicator.close();
			   
			    Toast({
  	    		     message: resMsg,
  	    		     position: 'middle',
  	    		     duration: 1500
  	    	    });
			   if(resCode=='0') 
			   {
			       //清除购物车清单
			       
			       __this.cartList=[];
			       localStorage.setItem("cartList",[]);
			       //向FootBar.vue发事件，切换至“我的"
                   __this.$bus.emit('showTab','我的');
                   
                   //向my.vue发事件switchMyTab，让订单处于选中
                   __this.$bus.emit('switchMyTab','订单');
			        
			   }
                
            },
            
            error: function (message) 
		    {
               Indicator.close();
			   
			    Toast({
  	    		     message: '貌似出了点问题，请稍后再试',
  	    		     position: 'middle',
  	    		     duration: 1500
  	    	    });
            }
             
              
         });
         
          
        }
        
     },
        
        mounted(){
        
           this.calCartList ();
        },
        
         created(){
              // 监听来自myDialog.vue中加入购物车动作事件，由$emit发出 
             this.$bus.on('cartChange', (val) => {
               //alert('--rev cartChange--');
               //让购物车中的商品及时更新
              this.cartList=JSON.parse(localStorage.getItem("cartList"));
                
             });
             
             this.$bus.on('memberChange', (val) => {
               
               this.member=val;
               
              
           
                
             });
             
             
       
       }
        
        
        
    }
</script>
<style scoped>
    .cart{
        margin: 1px;
        background: #fff;
        border: 1px solid #dddee1;
        border-radius: 10px;
    }
    .cart-header-title{
        padding: 16px 32px;
        border-bottom: 1px solid #dddee1;
        border-radius: 10px 10px 0 0;
        background: #f8f8f9;
    }
    .cart-header-main{
        padding: 8px 32px;
        overflow: hidden;
        border-bottom: 1px solid #dddee1;
        background: #eee;
        
    }
    .cart-empty{
        text-align: center;
        padding: 32px;
    }
    .cart-header-main div{
        text-align: left;
        float: left;
        font-size: 14px;
    }
    div.cart-info{
        width: 25%;
        text-align: left;
        overflow:auto;
        
    }
   
    .cart-price{
        width: 15%;
        overflow:auto;
        text-align:left;
    }
    .cart-count{
        width: 35%;
        overflow:auto;
        text-align:left;
    }
    .cart-cost{
        width: 15%;
        overflow:auto;
        text-align:left;
    }
    .cart-delete {
        width: 10%;
        overflow:auto;
        text-align:left;
    }
    .cart-extend{
    
       width:100%;
       text-align:left;
       padding:5px 15px;
      
    }
    .cart-content-main{
        padding: 5px 32px;
        
        text-align: center;
        border-bottom: 1px dashed #e9eaec;
        overflow: hidden;
    }
    .cart-content-main div{
        float: left;
    }
    .cart-content-main img{
        width: 40px;
        height: 40px;
        position: relative;
        top: 10px;
    }
    .cart-control-minus,
    .cart-control-add{
        display: inline-block;
        margin: 0 4px;
        width: 24px;
        height: 24px;
        line-height: 22px;
        text-align: center;
        background: #f8f8f9;
        border-radius: 50%;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        cursor: pointer;
    }
    .cart-control-delete{
        cursor: pointer;
        color: #2d8cf0;
    }
    .cart-promotion{
        padding: 16px 32px;
    }
    .cart-control-promotion,
    .cart-control-order{
        display: inline-block;
        padding: 8px 32px;
        border-radius: 6px;
        background: #2d8cf0;
        color: #fff;
        cursor: pointer;
    }
    .cart-control-promotion{
        padding: 2px 6px;
        font-size: 12px;
        border-radius: 3px;
    }
    .cart-footer{
        padding: 32px;
        text-align: right;
    }
    .cart-footer-desc{
        display: inline-block;
        padding: 0 16px;
    }
    .cart-footer-desc span{
        color: #f2352e;
        font-size: 20px;
    }
</style>