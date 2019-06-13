<template>
  <div class="page-tabbar">

    <div class="page-wrap">

      <div class="page-title">
     
          <mt-header fixed :title="shop.shop_name">
            <router-link to="/" slot="left">
             <img :src="headimgurl" width="25" height="25" >
            
           </router-link>
          <mt-button  slot="right" class="inform">
              <mt-badge type="error">10</mt-badge>
           </mt-button>
       </mt-header>
       
      </div> <!-- end of page-title -->
      
      <div class="slider" v-show="adShow">
         <mt-swipe>
         <mt-swipe-item>
           好消息！农场有新货啦！
           <img src="../images/ban1.jpg">
         </mt-swipe-item>
         <mt-swipe-item>
          六月夏令营强势来袭！
          <img src="../images/ban2.jpg">
        </mt-swipe-item>
         <mt-swipe-item>
           热带作物新品引进花都！
           <img src="../images/ban3.jpg">
         </mt-swipe-item>
      </mt-swipe>
      
      </div> <!-- end of slider -->
      
      
      
     <mt-cell class="page-part" title="当前位置" :value="selected" />
      
      
    
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        
    
      <mt-tab-container-item id="主页">
              
              <!-- start of  mt-navbar -->
              <mt-navbar v-model="category_selected" style="overflow:scroll">
                 <mt-tab-item  v-for="category in categorys" :key="category.name" :id="category.name">
                   <h4 style="font-weight:bold;font-size:1.2em;"> {{ category.name }} </h4>
                 </mt-tab-item>

              </mt-navbar>
              
              <!-- end of mt-navbar -->
              
              <mt-tab-container v-model="category_selected">
              
                  <mt-tab-container-item  v-for="category in categorys" :key="category.name" :id="category.name">
                    
                    <!-- 展示商品-->
                    
                    <div v-show="list.length">
               
                      <Product v-for="item in list" :info="item" :key="item.id"> </Product>
                  
                   
                     <div class="product-not-found" v-show="!list.length">
                        暂无相关信息
                      </div>
                      
                      
                     
               
                  </div> 
                  
                  <!-- <PopupItem> </PopupItem>-->
                  
                  <MyDialog></MyDialog>
                  
                  <!--  end of 展示商品 --> 
                 </mt-tab-container-item>
               
             </mt-tab-container>
             
              
             

                     
      </mt-tab-container-item> <!-- end of 主页-->
              
              
              
        <mt-tab-container-item id="客服">
           <!--
           <router-link to="/action_win">Action Window</router-link>
           <router-link to="/modal">Modal</router-link>
           -->
           
           <Kefu></Kefu>
           
           <ChatWin></ChatWin>
           
        </mt-tab-container-item>
        <mt-tab-container-item id="门店" v-model="shop">
          <mt-cell :title="shop.shop_name">
            <img slot="icon" :src="shop.objectKey" width="120" height="120">
          </mt-cell>
          <mt-cell :title="shop.shop_address"></mt-cell>
          <mt-cell :title="shop.shop_tel"></mt-cell>
        </mt-tab-container-item>
        
        <mt-tab-container-item id="购物车">
          
            <Cart/> 
          
        </mt-tab-container-item>
        
        <mt-tab-container-item id="我的">
           
          <!-- tab start -->
          
          
           <My></My>
          
          
          
          <!-- tab end -->
           
          
           
           
        </mt-tab-container-item>
      </mt-tab-container>
      
    </div> <!-- end of page-wapper -->

    <mt-tabbar v-model="selected" fixed>
      <mt-tab-item v-for="menu in menus" :id="menu.name" :key="menu.id"  @click.native="switchIcon(menu.image)">
        
        
        <img slot="icon" :src="menu.image" style="cursor:pointer;" > 
            
            {{ menu.name }}  
         </img>
         
     
      </mt-tab-item>
    
    </mt-tabbar>
  </div> <!-- end of page-tabber -->
  
  
</template>

<script>
 
import Product from '../components/product.vue';
import Cart from '../components/cart.vue';
import MyDialog from '../components/myDialog.vue';
import My from '../components/my.vue';
import Kefu from '../components/kefu.vue';
import ChatWin from '../components/chatWin.vue';
import { Navbar, TabItem } from 'mint-ui';
import $ from 'jquery';
import constants from '../utils/constants.js';
export default {
  components:{Product,Cart,MyDialog,My,Kefu,ChatWin},
 
  computed:{
     list_old () {
       
        return this.$store.state.productList;
     },
     
      menus (){
         return  this.$store.state.menus;
     },
     
     adShow() {
       
         return this.$store.state.adShow;
     
     }, 
     
     categorys () {
     
         return this.$store.state.categorys;
     }
     
     
  
  },
  methods:{
    
    
    
    fetchProductList(){
         
          
          var __this=this;
         
          $.ajax({
           type:"POST",
           contentType: "application/json; charset=utf-8",
           url:__this.domain+"/sales/getproductlist", 
           data:"{\"java\":\"OK\"}",
           datatype: "json",
           success: function (message) 
		   {
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			   //console.log('--Member_authen='+JSON.stringify(message.member_authen));
			   //console.log('--shop='+JSON.stringify(message.shop));
			   //console.log('--member='+message.member);
			   message.items.forEach(t=>{
			      __this.list.push(t);
			   });
               
               
               if(message.shop != null ){
                   localStorage.setItem("shop",JSON.stringify(message.shop));
                   var temShop=message.shop;
                   __this.shop.shop_name=temShop.shop_name;
                   __this .shop.shop_address=temShop.shop_address;
                   __this.shop.shop_discription=temShop.shop_discription;
                   __this.shop.objectKey=temShop.objectKey;
                   __this.shop.shop_tel=temShop.shop_tel;
                   
                   //console.log('--shop_name='+__this.shop.shop_name);
               }
               if(message.member_authen != null ){
               
                  __this.headimgurl=message.member_authen.headimgurl;
                  //告诉my.vue组件更新数据
                  __this.$bus.emit('memberAuthenChange',message.member_authen);
                 // alert('---fetchProductList---'+message.member_authen);
                  localStorage.setItem("global.member_authen",JSON.stringify(message.member_authen));
                   
               }
               if(message.member != null ){
                 //告诉my.vue组件更新数据
                  __this.$bus.emit('memberChange',message.member);
                  localStorage.setItem("global.member",JSON.stringify(message.member));
                  // alert('---fetchProductList---'+message.member);
               }
               
               localStorage.setItem("productList",JSON.stringify(__this.list));
            },
            
            error: function (jqXHR, textStatus, errorThrown) 
		    {
               
			     alert("貌似出了点问题，请稍后再试"); 
            }
            
            
              
         });
        
       
     
     },
    
    
      switchIcon (src) {
         
         var b=(src.indexOf('home')>0);
        
         if(b){
          this.$store.dispatch('getAdShowTrue');
         }else{
            this.$store.dispatch('getAdShowFalse');
         }
         
         
         
         this.$store.state.menus.forEach(function(item){
              if(src == item['image'])//点击的ICON变成激活图片
              {
                
                if(src.indexOf('_active.png') === -1)//not active
                {
                   var len=item['image'].indexOf(".png");
                   var preffix=src.substring(0, len);
                   item['image']=preffix+'_active.png';
                }
              
              }else{//未点击的ICON全部变成未激活图片
                var len =item['image'].indexOf('_active.png');
                if(len > 0)
                {
                   var preffix=item['image'].substring(0, len);
                   item['image']=preffix+'.png';
                }
              }
              
             
         });
     }
  
  },
  created () {
   
      // 监听来自cart.vue中切换窗口的事件,用户结算下单，需要校验登录 
      this.$bus.on('showTab', (val) => {
           
          
          this.selected=val;   
                
      });
  
  },
  
  mounted(){
      //mounted 阶段初始化商品列表, 存储在store.state.productList中。
      this.$store.dispatch('getProductList');
      this.$store.dispatch('getMenus');
      this.$store.dispatch('getCategorys');
      this.fetchProductList();
  
  },
  
  
 
  name: 'FootBar',
  
  data() {
    return {
   
      selected: '主页',
      category_selected:'科普体验',
      list:[],
      shop: {'shop_name':'','shop_address':'','shop_discrption':'','objectKey':''},
      headimgurl:'../images/wenbixia.jpg',
      domain: constants.domain
    };
  },
  
  watch: {
       selected: function (val, oldVal) {
        //alert(val+','+oldVal);
         
         
      }
    }
};
</script>

<style scoped>
  .page-tabbar {
    overflow: hidden;
  }
  .slider{
       height:300px;
       padding:1px 3px;
       border-bottom:1px solid gray;
   }
   
 
   .page-wrap {
    overflow: auto;
    height: 100%;
    padding-top:40px;
    padding-bottom: 60px;
    background:#FAFAFA;
    
    
 
  }
  
  
</style>
