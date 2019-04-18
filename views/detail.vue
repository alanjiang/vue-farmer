<template>



  <div>
  
  <div class="product"> 
            
 <mt-header fixed title="好吃点农场">
            <router-link to="/" slot="left">
            <mt-button icon="back">主页</mt-button>
           </router-link>
          <mt-button  slot="right">
              <mt-badge type="error">10</mt-badge>
           </mt-button>
 </mt-header>

  
  
    <div class="product-image">
    
       <img  :src="product.image" width="220" height="220"> 
      
    </div>
    <div class="product-info">
      
   <p class="brief">    
     <h4>{{ product.name }}</h4> 
     <h4>¥<font color="red"> {{ price }}</font> </h4>
     <h4 class="scale" v-show="scale === 'yes'">规格: {{ selected }}</h4>
     <h4 v-if="remain<=0">此规格暂无货</h4>
     <h4 v-else>剩余:<font color="red"> {{ remain }} </font> </h4>
     
   </p> 
   
    </div>
  
  </div>
  

  <div class="page-picker">

    <div class="page-picker-wrapper" v-show="scale === 'yes'">
      <mt-picker :slots="slots"  :visible-item-count="3" @change="onValuesChange"></mt-picker>
    </div>
  </div>
  
  <p style="padding:3px;margin:0px;text-align:center;">
   <mt-button size="large" style="cursor:pointer;" type="primary" @click.native="addToCart">加入购物车</mt-button>
  </p>
 
    
  
  <h4>商品介绍</h4>
  <p style="text-indent:2em;">
  一边是棚架上满挂的晶莹剔透的葡萄，一边是采摘品尝过后停不下来的游人客商。1月13日至14日，省农业厅主办的海南热带葡萄品牌推介暨采摘季活动，吸引了大批电商、采购商以及市民参与，众人相继走进海口、三亚、东方的种植基地，享受采摘之乐，感受海南本地葡萄之鲜甜。
  </p>
 </div>
</template>
<script>
    import { Picker,Toast } from 'mint-ui';
    
    export default {
        data () {
            return {
                // 获取路由中的参数
                id: parseInt(this.$route.params.id),
                product: null,
                price:0,
                scale:'no',
                remain:0,
                selected:'',
                symbol:null,
                count:0,
                slots:
				[ {
		           flex: 1,
		           values: this.get_mer_attr_array(),
		           className: 'slot1',
		           textAlign: 'left'
		        }
		        
		        
			  ]


            }
        },
        methods: {
            getProduct () {
                
                const datas=localStorage.getItem('productList');
                const products=JSON.parse(datas);
                
                if(datas){
                    this.product = products.find(item => item.id === parseInt(this.$route.params.id));
                    
                }else{
                   this.product = this.$store.getters.products.find(item => item.id === parseInt(this.$route.params.id));
                   
                }
                
            },
            // 加入购物车
            addToCart () {
      
                if(this.scale == 'yes' ){
                  
                   if(this.remain ==  0){
                     Toast({
                           message: '此商品暂时缺货!',
                           iconClass: 'icon icon-error'
                         });
                         
                        return;
                   }
                }
                
                //调用main.js中的addCart方法
                
                var params={'id':this.$route.params.id,'symbol':this.symbol};
                
                this.$store.commit('addCart', params);
                
                
                Toast({
                message: '添加成功!',
                iconClass: 'icon icon-success'
                });
                
                
               
            },
            
            onValuesChange(picker, values) { 
                var datas=localStorage.getItem('productList');
                var products=JSON.parse(datas);
                var obj=products.find(item => item.id === parseInt(this.$route.params.id));
                if(obj){
                   
                   if(obj.mer_attr_price){
                    var selected_item={};
                    obj.mer_attr_price.forEach(t=>{
                        if(t.label == values){
                           selected_item=t;
                           this.price=selected_item.price;
                           this.remain=selected_item.num;
                           this.selected=t.label;
                           //alert('---mer='+t.symbol);
                           this.symbol=t.symbol;
                           return;
                        }
                    });
                     
                      
                   }
                }
                
                
            } ,
            
            get_mer_attr_array(){
            
               var array=[];
                var datas=localStorage.getItem('productList');
                var products=JSON.parse(datas);
                if(products){
                 var obj=products.find(item => item.id === parseInt(this.$route.params.id));
                 var array=[];
                 
                 if(obj){
                 this.price=obj['price'];//没有规格的，设置默认的价格
                   if(obj.mer_attr_price){
                          this.scale='yes';
                          obj.mer_attr_price.forEach(function(it){
                              array.push(it['label']);
                         });
                     }
                     
                     
                  }  
                }
                
                return array;
                
            }
         
        },
        created () {
           
        
            this.getProduct();
            
            this.get_mer_attr_array();
        }
    }
</script>
<style scoped>

    .product{
        margin-top: 55px;
        padding: 5px;
        background: #FFFFF0;
        border: 1px solid #dddee1;
        border-radius: 10px;
        overflow: auto;
        
    }
    .product-image{
        border-radius: 10px;
        padding:5px;
        width: 250px;
        height:100%;
        display:block;
        float: left;
        text-align: center;
    }
    .product-info{
       
        height:100%;
        line-height:2em;
        position:relative; 
     
        overflow:hidden;
        text-align: left;
    }
    p{       
    
     border-radius: 10px;
     background:#fff; 
     padding:5px 5px;
   }
    
    .price{
       font-size:1.1em;
       font-weight:normal;
    }
    .brief{
       text-indent:2em;
    }
    h4{
      height:25px;
      font-weight:normal;
      width:100%;
      padding:3px;
      
    }
    h4 .scale{
      height:45px;
      overflow:auto;
    }
    
</style>