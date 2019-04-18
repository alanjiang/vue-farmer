import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import Vuex from 'vuex';
import Axios from 'axios';


import product_data from './utils/product.js';

import menus from './utils/menus.js';
import categorys from './utils/categorys';
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'; 
import VueBus from 'vue-bus';
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Mint);
Vue.use(VueBus);

// 路由配置
const Routers = [
	 {
	        path: '/index',
	        meta: {
	            title: 'Foot Bar'
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
        path: '/myDialog',
        meta: {
            title: 'My Dialog'
        },
        component: (resolve) => require(['./views/myDialog.vue'], resolve)
    },
   
    
    {
        path: '/detail/:id',
        meta: {
            title: '商品详情页面'
        },
        component: (resolve) => require(['./views/detail.vue'], resolve)
    },
    
    {
        path: '*',
        redirect: '/index'
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
		//alert('---1='+JSON.stringify(data));
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
		//alert('--state.cartList='+state.cartList.length);
		if(state.cartList.length>0){
			cars=state.cartList;
		}else{
			cars=JSON.parse(localStorage.getItem("cartList"));
			
		}
		
		if(cars==null){
			cars=[];
		}
		//alert('--cartList='+cars.length);
		var id=params.id;
		var symbol=params.symbol;
        // 先判断购物车是否已有，如果有，数量+1, id+symbol必须相同
        var products=[];
        //alert('---state.productList.length='+state.productList.length);
        if(state.productList.length>0){
            	products= state.productList;
        }
        if(localStorage.getItem("productList")!=null){
            	products= JSON.parse(localStorage.getItem("productList"));
        }
        
        if(products==null){
        	alert('--Data Wrong---') ;
        	return;
        }
           //提取商品的基础信息
        var obj=products.find(item => item.id == id);
            
        if(!obj) { alert('--Data Wrong---') ;}
            
                
        if(cars.length == 0){ //购物车是空的
    	    	
    	    	
    	    	obj.count=1;
    	    	obj.symbol=symbol;
    	    	var mer= obj.mer_attr_price.find(mar=> mar.symbol == symbol);
    	    	
    	    	if(mer){
    	    		obj.label=mer.label;
    	    		obj.price=mer.price;
    	    		obj.num=mer.num;
    	    	}
    	    	cars.push(obj);
    	    	
    	    	state.cartList=cars;
    	    	localStorage.setItem("cartList",JSON.stringify(cars));
    	        
    	        
    	        
    	    }
         
       
           var cart_item= cars.find(item => item.id == obj.id && item.symbol == symbol );
         
       
          if(cart_item){//重复
        	  cars.find(item=>{
        		  
        	   
           	   if(item.id == obj.id && item.symbol == symbol ){
           		 
           		   item.count=item.count+1;
           		   
           	   }
           	  
             });
          }else{//新增
            obj.symbol=symbol;
            obj.count=1;
            			 
            if(obj.mer_attr_price){
            	var mer= obj.mer_attr_price.find(mar=> mar.symbol === symbol);
            	if(mer){
                  obj.label=mer.label;
                  obj.price=mer.price;
                  obj.num=mer.num;
                }
            }else{
            	obj.label='';
            }
            
            cars.push(obj);		 
            			 
          }
        state.cartList=cars;
        localStorage.setItem("cartList",JSON.stringify(cars));
        
      } ,//end of addToCart 
    
    // 修改商品数量
    editCartCount (state, payload) {
    	
    	var cars=[];
		
		if(state.cartList.length>0){
			cars=state.cartList;
		}else{
			cars=JSON.parse(localStorage.getItem("cartList"));
		}
		
        const product = cars.find(item => {
        
        	 if(item.id == payload.id && item.symbol == payload.symbol){
        		item.count=payload.count;
        		 
        	}
        });
        state.cartList=cars;
        localStorage.setItem("cartList",JSON.stringify(state.cartList));
    },
    // 删除商品
    deleteCart (state, params ) {
    	var id=params.id;
		var symbol=params.symbol;
        var cars=[];
		if(state.cartList.length>0){
			cars=state.cartList;
		}else{
			cars=JSON.parse(localStorage.getItem("cartList"));
		}
		
        const index = cars.findIndex(item => (item.id === id && item.symbol === symbol ));
        cars.splice(index, 1);
        state.cartList=cars;
        localStorage.setItem("cartList",JSON.stringify(state.cartList));
    },
    // 清空购物车
    emptyCart (state) {
        state.cartList = [];
        localStorage.setItem("cartList",JSON.stringify(state.cartList));
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