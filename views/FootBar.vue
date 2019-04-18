<template>
  <div class="page-tabbar">

    <div class="page-wrap">

      <div class="page-title">
     
          <mt-header fixed title="好吃点农场">
            <router-link to="/" slot="left">
             <img src="../images/wenbixia.jpg" width="25" height="25" >
            
           </router-link>
          <mt-button  slot="right">
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
              <mt-navbar v-model="category_selected">
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
                  
                   <PopupItem> </PopupItem>
                  
                  <!--  end of 展示商品 --> 
                 </mt-tab-container-item>
               
             </mt-tab-container>
             
              
             

                     
      </mt-tab-container-item> <!-- end of 主页-->
              
              
              
        <mt-tab-container-item id="客服">
          
           <router-link to="/myDialog">My Dialog</router-link>
             
          
        </mt-tab-container-item>
        <mt-tab-container-item id="门店">
          
          <Product/>
          
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
import PopupItem from '../components/popup.vue';
import My from '../components/my.vue';
import { Navbar, TabItem } from 'mint-ui';

export default {
  components:{Product,Cart,PopupItem,My},
 
  computed:{
     list () {
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
    
      switchIcon (src) {
         
         var b=(src.indexOf('home')>0);
         //alert('--b='+b+',---this.$store='+this.$store);
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
  mounted(){
      //mounted 阶段初始化商品列表, 存储在store.state.productList中。
      this.$store.dispatch('getProductList');
      this.$store.dispatch('getMenus');
      this.$store.dispatch('getCategorys');
      
      
      
  
  },
  
  
 
  name: 'FootBar',
  
  data() {
    return {
   
      selected: '主页',
      
      category_selected:'科普体验'
      
      
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
