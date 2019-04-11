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

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Mint);


Vue.prototype.$axios = Axios;


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
/*
router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title;
    next();
});

router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
});*/
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
		sessionStorage.setItem("productList",JSON.stringify(data));
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
	// 添加到购物车
    addCart (state, id) {
		
		//alert('--main id='+id);
        // 先判断购物车是否已有，如果有，数量+1
		var isAdded='Y';
		var count=1;
		if(state.cartList.size === 0) {
			isAdded='N';
		}else{
			if(state.cartList.find(item => item.id === id)){
                 isAdded='Y';
			}else{
				 isAdded='N';
			}
		}
       
        //alert('---isAdded='+isAdded);
        if (isAdded === 'Y') {
            count ++;
        } else {
            state.cartList.push({
                id: id,
                count: 1
            })
        }
        //alert('---'+isAdded+','+count);
    },
    
    
    // 修改商品数量
    editCartCount (state, payload) {
        const product = state.cartList.find(item => item.id === payload.id);
        product.count += payload.count;
    },
    // 删除商品
    deleteCart (state, id) {
        const index = state.cartList.findIndex(item => item.id === id);
        state.cartList.splice(index, 1);
    },
    // 清空购物车
    emptyCart (state) {
        state.cartList = [];
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