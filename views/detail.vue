<template>


  <div>
  
  
  <mt-cell title="" label="描述信息" is-link>
  
  
    
    {{ product.name }}
   ¥ {{ product.cost }}
              
  
  </mt-cell>
  
  <mt-cell>
  <div class="product" @click="handleAddToCart"> <img :src="product.image"> </div>
    
  </mt-cell>
  
  </div>
  
  
   
</template>
<script>
    
    export default {
        data () {
            return {
                // 获取路由中的参数
                id: parseInt(this.$route.params.id),
                product: null
            }
        },
        methods: {
            getProduct () {
                
                //alert(this.$store.getters.products.length);
                const datas=sessionStorage.getItem('productList');
                alert('---datas='+datas);
                const products=JSON.parse(datas);
                alert('---products='+products);
                if(datas){
                    this.product = products.find(item => item.id === this.id);
                }else{
                   this.product = this.$store.getters.products.find(item => item.id === this.id);
                }
                
            },
            // 加入购物车
            handleAddToCart () {
                this.$store.commit('addCart', this.id);
            }
        },
        mounted () {
            //alert('---mounted--');
            
            this.getProduct();
        }
    }
</script>
<style scoped>
    .product{
        margin: 32px;
        padding: 32px;
        background: #fff;
        border: 1px solid #dddee1;
        border-radius: 10px;
        overflow: hidden;
    }
    .product-image{
        width: 50%;
        height: 550px;
        float: left;
        text-align: center;
    }
    .product-image img{
        height: 100%;
    }
    .product-info{
        width: 50%;
        padding: 150px 0 250px;
        height: 150px;
        float: left;
        text-align: center;
    }
    .product-cost{
        color: #f2352e;
        margin: 8px 0;
    }
    .product-add-cart{
        display: inline-block;
        padding: 8px 64px;
        margin: 8px 0;
        background: #2d8cf0;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
    }
    .product-desc{
        background: #fff;
        margin: 32px;
        padding: 32px;
        border: 1px solid #dddee1;
        border-radius: 10px;
        text-align: center;
    }
    .product-desc img{
        display: block;
        width: 50%;
        margin: 32px auto;
        padding: 32px;
        border-bottom: 1px solid #dddee1;
    }
</style>