import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import Vuex from 'vuex';
import axios from 'axios';

import product_data from './utils/product.js';

import menus from './utils/menus.js';
import categorys from './utils/categorys';
//import { Field,Toast,Button,Indicator,Navbar,Cell,Picker,ActionSheet}  from 'mint-ui';
import Mint from 'mint-ui';
import {Toast} from 'mint-ui';
import 'mint-ui/lib/style.css'; 
import VueBus from 'vue-bus';

import VDistpicker from 'v-distpicker';
import Dialog from 'hsy-vue-dialog';

//引入样式
import 'vue-easytable/libs/themes-base/index.css';
import {VTable,VPagination} from 'vue-easytable';
Vue.component(VTable.name, VTable);
Vue.component(VPagination.name, VPagination);

Vue.use(Dialog);

Vue.component('v-distpicker', VDistpicker);


Vue.use(Vuex);
Vue.use(VueRouter);
//Field,Toast,Button,Indicator,Navbar,Cell,Picker,ActionSheet
Vue.use(Mint);


Vue.use(VueBus);

Vue.prototype.$http = axios;

// 路由配置
const Routers = [
	 {
	        path: '/index_prod.html',
	        meta: {
	            title: '智慧农场'
	        },
	        component: (resolve) => require(['./views/FootBar.vue'], resolve)
	 },
    {
        path: '/footBar',
        meta: {
            title: '首页'
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '/ajax',
        meta: {
            title: 'Ajax Demo'
        },
        component: (resolve) => require(['./views/ajax.vue'], resolve)
    },
    {
        path: '/about',
        meta: {
            title: '关于'
        },
        component: (resolve) => require(['./views/about.vue'], resolve)
    },
    {
        path: '/user/:id',
        meta: {
            title: '个人主页'
        },
        component: (resolve) => require(['./views/user.vue'], resolve)
    },
    {
        path: '/order',
        meta: {
            title: 'MyOrder'
        },
        component: (resolve) => require(['./views/order.vue'], resolve)
    },
    
    {
        path: '/vuexdemo',
        meta: {
            title: 'vuexdemo'
        },
        component: (resolve) => require(['./views/vuexdemo.vue'], resolve)
    },
    
    {
        path: '/modal',
        meta: {
            title: 'Modal'
        },
        component: (resolve) => require(['./components/loginModal.vue'], resolve)
    },
    /*
    {
        path: '/detail/:id',
        meta: {
            title: '商品详情页面'
        },
        component: (resolve) => require(['./views/detail.vue'], resolve)
    },*/
    
    {
        path: '*',
        redirect: '/index_prod.html'
    }
];
const RouterConfig = {
    // 使用 HTML5 的 History 路由模式
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title;
    next();
});

router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
});
const state = {
  count: 0,
  productList:[],
  cartList:[],
  menus:null,
  adShow:true,
  categorys:[]
}
const mutations = {
    increment (state) {
	  state.count++
	},
	decrement (state) {
	  state.count--
	},
	setProductList(state,data) {
		
		
		state.productList=data;
		//console.log('--datas='+JSON.stringify(data));
		localStorage.setItem("productList",JSON.stringify(data));
	},
	
	setMenus(state, menu_datas){
		
		state.menus=menu_datas;
	},
	
	setAdShow(state, as){
		//alert('----set adShow:'+as);
		 state.adShow=as;
	},
	setCategorys(state,category_datas){
		state.categorys=category_datas
	},
	// 添加到购物车,detail.vue中调用
    addCart (state, params) {
	   
		
		var cars=[];
	
		if(localStorage.getItem("cartList") != null){
			cars=JSON.parse(localStorage.getItem("cartList"));
		}
		
		var id=params.id;
		var symbol=params.symbol;
		var count=params.count;
        var products=[];
        if(localStorage.getItem("productList")!=null){
            	products= JSON.parse(localStorage.getItem("productList"));
        }
        
        
        if(products==null){
        	alert('请升级您的浏览器')
        	return;
        }
           //提取商品的基础信息
        var obj=products.find(item => item.id == id);
            
        if(!obj) { alert('未找到对应的商品，您需要的商品可能已经下架') ;}    
        //1,购物车是空的
        
        if(cars.length == 0)
        { 
    	    	obj.count=count;
    	    	obj.symbol=symbol;
    	    	var mer= obj.mer_attr_price.find(mar=> mar.symbol == symbol);
    	    	if(mer){
    	    		obj.label=mer.label;
    	    		obj.price=mer.price;
    	    		obj.num=mer.num;
    	    	}else
    	    	{
    	    		obj.label='';
    	    	}
    	    	
    	    	cars.push(obj);  
    	    	localStorage.setItem("cartList",JSON.stringify(cars));
    	    	Toast({
  	    		  message: '成功加入购物车',
  	    		  position: 'middle',
  	    		  duration: 500
  	    	     });
    	    	
    	    	return;
    	        
    	}
         
         //2, 购物车不是空的
         var cart_item= cars.find(item => item.id == obj.id && item.symbol == symbol );
         //2.1 商品重复,ID+symbol
         if(cart_item)
         {
        	  cars.find(item=>{
        		  
        	   
           	   if(item.id == obj.id && item.symbol == symbol ){
           		 
           		   item.count=item.count+count;
           		   localStorage.setItem("cartList",JSON.stringify(cars));
           		  
           	   }
           	  
             });
          }else //2.2 新增商品
          {
            obj.symbol=symbol;
            obj.count=count;
            //2.2.1 商品有规格，多种价格 			 
            if(obj.mer_attr_price)
            {
            	 var mer= obj.mer_attr_price.find(mar=> mar.symbol === symbol);
            	 if(mer)
            	  {
                  obj.label=mer.label;
                  obj.price=mer.price;
                  obj.num=mer.num;
                 }
             }else//2.2.2 商品没有规格
             { 	
            	   obj.label='';
             }
            
                cars.push(obj);		 
                localStorage.setItem("cartList",JSON.stringify(cars));	
              
       }
        
         Toast({
	    		  message: '成功加入购物车',
	    		  position: 'middle',
	    		  duration: 1000
	    	  });
        
      } ,//end of addToCart 
    
    // 修改商品数量
    editCartCount (state, payload) {
    	
    	  
    	var cars=JSON.parse(localStorage.getItem("cartList"));
        cars.find(item => {
        	 if(item.id == payload.id && item.symbol == payload.symbol){
        		item.count=payload.count; 
        	}
        });
        
        localStorage.setItem("cartList",JSON.stringify(cars));
      
        
    },
    // 删除商品
    deleteCart (state, params ) {
    	var id=params.id;
		var symbol=params.symbol;
        var cars=JSON.parse(localStorage.getItem("cartList"));
        const index = cars.findIndex(item => (item.id === id && item.symbol === symbol ));
        cars.splice(index, 1);
        
        localStorage.setItem("cartList",JSON.stringify(cars));
        
    },
    // 清空购物车
    emptyCart (state) {
        cartList = [];
        localStorage.setItem("cartList",JSON.stringify(cartList));
       
    }
	
	
	
}
const actions = {
	increment: ({ commit }) => commit('increment'),
	decrement: ({ commit }) => commit('decrement'),  
	
	
    getProductList ({ commit ,state})
    {	  
			  commit('setProductList',product_data)
	} ,
		  
    incrementIfOdd ({ commit, state }) 
    {
		    if ((state.count + 1) % 2 === 0) {
		      commit('increment')
		    }
	},
   incrementAsync ({ commit }) 
   {
		    return new Promise((resolve, reject) => 
		     {
		        setTimeout(() => {
		           commit('increment')
		           resolve()
		          }, 1000)
		      })
		  
   },
  
      getMenus ({commit, state}){
		
		commit('setMenus',menus)
	  },
	  
	    getAdShowFalse ({commit, state}){
			
			commit('setAdShow',false)
	   },
	   getAdShowTrue ({commit, state}){
			
			commit('setAdShow',true)
	   },
	  getCategorys ({commit, state}){
		  
			commit('setCategorys',categorys)
	   }
   
}

// getters are functions
const getters = {
  evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd',
  products: state => state.productList,
  total_size: (state,getters) =>getters.products.length
  
}



const store= new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});

new Vue({
    el: '#app',
    router: router,
    store:store,
    render: h => {
        return h(App)
    }
});

Vue.prototype.image_auto = function (maxWidth,maxHeight,objImg){
	

	var img = new Image();
    img.src = objImg.src;
    //alert('--img src='+img.src);
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
    objImg.height = h;
    objImg.width = w;

}