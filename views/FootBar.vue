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
        
         <mt-swipe-item :auto="2000">
          <a href="#">
           <img class="swipe-img" src="../images/ban1.jpg">
          </a>
           <span class="desc">景丰热科农场葡萄熟啦，接受免费采摘预定报名!</span>  
         </mt-swipe-item>
       
         <mt-swipe-item>
           
            <a href="#">
          <img class="swipe-img" src="../images/ban2.jpg">
           </a>
            <span class="desc">千亩良田,绿树成荫,亲子游玩正当时!</span>  
        </mt-swipe-item>
         <mt-swipe-item>
           
            <a href="#">
           <img class="swipe-img" src="../images/ban3.jpg">
           </a>
            <span class="desc">景丰热科农场，集产、学、研、亲子、观光、科普于一体的现代化农场。</span> 
         </mt-swipe-item>
         
          <mt-swipe-item>
           <a href="#">
           
           <img class="swipe-img" src="../images/ban4.jpg">
           </a>
           <span class="desc"> 景丰热科农场体内设验馆，随时欢迎您的到来！ </span> 
         </mt-swipe-item>
         <mt-swipe-item>
         <a href="#">
            
           <img class="swipe-img" src="../images/ban5.jpg">
          </a>
           
           <span class="desc">现场体验纯正手工咖啡、巧克力制作趴, 咖啡豆等一切材料产自景丰热科农场。 </span> 
         </mt-swipe-item>
      </mt-swipe>
      
      </div> <!-- end of slider -->
      
      
      
     <mt-cell class="page-part" title="当前所在位置" :value="selected" />
      
      
    
      <mt-tab-container class="page-tabbar-container"  v-model="selected">
        
    
      <mt-tab-container-item id="主页">
              
              <!-- 横向菜单条  mt-navbar -->
               
                <!--
                <div  ref="wrapper" class="wrapper" v-model="category_selected">
                 <ul ref="content">
                   <li v-for="category in categorys" :key="category" :id="category"  @click="switchCategory(category)">  {{ category }} </li>
                 </ul>
                 </div>
                 -->
                 
                 <mt-navbar v-model="category_selected"> 
                  <div class="wrapper" ref="wrapper">
                   <div class="content" ref="content">
                   <mt-tab-item class="class-tab-item" v-for="category in categorys" :key="category" :id="category" @click.native="switchCategory(category)">
                      {{ category }}
                   </mt-tab-item>
                  </div>
                 </div>
                 </mt-navbar>
                
           
              <!-- end of mt-navbar -->
              
              <mt-tab-container class="tab-con" v-model="category_selected">
              
                  <mt-tab-container-item  v-for="category in categorys" :key="category" :id="category">
                    
                    <!-- 展示商品-->
                    
                    <div v-show="list.length">
               
                      <Product v-for="item in filterList" :info="item" :key="item.id"> </Product>
                  
                   
                     <div class="product-not-found" v-show="!list.length">
                        暂无相关信息
                      </div>
                      
                      
                     
               
                  </div> 
                  
                  <!--  end of 展示商品 --> 
                  
               
                  </mt-tab-container-item>
                  
                  
                  <!-- 弹出的商品挑选窗口 -->
                  <MyDialog></MyDialog>
             
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
            <img slot="icon" :src="shop.objectKey" >
          </mt-cell>
          <mt-cell :title="shop.shop_address"></mt-cell>
          <mt-cell :title="shop.shop_tel"></mt-cell>
          
          <mt-cell :title="shop.shop_discription"></mt-cell>
          
          
        </mt-tab-container-item>
        
        <mt-tab-container-item id="购物车">
          
            <Cart :member="member"></Cart>
          
        </mt-tab-container-item>
        
        <mt-tab-container-item id="我的">
           
          <!-- tab start -->
          
          
           <My :member="member"  :member_authen="member_authen"></My>
          
          
          
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
import BScroll from 'better-scroll'
export default {
  components:{Product,Cart,MyDialog,My,Kefu,ChatWin},
 
  computed:{
     
 
      menus (){
         return  this.$store.state.menus;
     },
     
     adShow() {
       
         return this.$store.state.adShow;
     
     }
     
    
     
     
  
  },
  methods:{
  
    verScroll () {
      var width = this.categorys.length*100
      //动态计算出滚动区域的大小，前面已经说过了，产生滚动的原因是滚动区域宽度大于父盒子宽度
      this.$refs.content.style.width = width + 'px'  // 修改滚动区域的宽度
      
      const options = {
        scrollY: false, 
        scrollX: true,
        mouseWheel: true,
        click: true,
        tap: true
      }
      var bScroll  = new BScroll(this.$refs.wrapper, options)
     
      bScroll.refresh();
        
    },
  

    switchCategory(c) {
         
         this.filterList=[];//先清空
         this.list.forEach(t=>{
         
           if(c == t.sort){
               this.filterList.push(t);
           }
         
         });
       
        
    },
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
			   
			   
			   message.items.forEach(t=>{
			      __this.list.push(t);
			      __this.filterList.push(t);
			   });
               
               
                //商品种类累加
               __this.list.forEach(t=>{
                  
                  if(__this.categorys.indexOf(t.sort) == -1 ){
                       __this.categorys.push(t.sort);
                  }
               });
               
               
              __this.$nextTick(() => {
                 __this.verScroll()
               });
               
               
               
               //商品种类默认的选取值
               
               __this.category_selected=__this.categorys[0];
               
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
               
               console.log('***返回结果message：'+ JSON.stringify(message));
               
               if(message.member_authen ){
                 
                 __this.member_authen = message.member_authen;
                  __this.headimgurl=message.member_authen.headimgurl;
                  //告诉my.vue组件更新数据
                  //__this.$bus.emit('memberAuthenChange',message.member_authen);
                 // alert('---fetchProductList---'+message.member_authen);
                  localStorage.setItem("global.member_authen",JSON.stringify(message.member_authen));
                   
               }
               
               
               
               if(message.member){
                 
                 __this.member = message.member;
                 
                 //告诉my.vue组件更新数据
                  //__this.$bus.emit('memberChange',message.member);
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
  /*
  "member_authen":{"id":4525,"type":"WECHAT","unionid":"ojMfy1fJQBkzG38T2YlvPODvENAo",
  "openid":"oURPO0rvd9y1wjMaXY8LKcINfnck","authen_time":"2019-06-16 10:31:06","nickname":"鹏哥","gender":"男","country":"中国","province":"广东","city":"广州","headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/rBa6mpicpDMGAicvxSxgsUplRR8bt2VK6Ey2J149SibhDlaXzachsey8KhtemsVZP2zmqUvfX95vwdw2vwSITbodg/132","lastvisittime":"2020-02-15 13:04:16","media_type":null,
  "member_id":5221,"shopid":2299,"visit_times":921},"member":null,
  
  */
  
 
  name: 'FootBar',
  
  data() {
    return {
      member_authen: {},
      member: {},
      selected: '主页',
      //商品类别默认的选项
      category_selected:'',
      //商品类别
      categorys:[],
      //商品列表
      list:[],
      //按分类过滤后的商品
      filterList:[],
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

<style lang="stylus" scoped>
 .page-tabbar
   overflow: hidden;
   .slider
       height:300px;
       padding:1px 3px;
   .page-wrap 
     overflow: auto;
     height: 100%;
     padding-top:40px;
     padding-bottom: 60px;
     background:#FAFAFA;
     .swipe-img 
       width: 100%
     .desc
       font-size: 12px
       opacity: .9
       padding: 5px
       height: 40px
       width: 100%
       color: #fff
       position: absolute
       bottom: 30px
       word-wrap: break-word 
       word-break: normal 
   .wrapper
    position: relative
    height: 30px
    width: 100%
    display: block
    
    .content
      height: 25px
      display: flex
      flex-direction: row
      padding: 2px
      .class-tab-item
         width: 100px
         height: 30px
         font-size: 14px
         font-weight: 500
         display: inline-block
         margin-right: 5px
         overflow: hidden
   .tab-con
      margin-top: 50px
   
</style>
