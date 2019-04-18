<template>


  <div>
  

  
  <div class="product"> 
  
  
    <div class="product-image">
    
       <img  :src="product.image" width="220" height="220"> 
      
    </div>
    <div class="product-info">
      
      <!--
       <ul>
         <li v-for=" mer in product.mer_attr_price" :key="mer.price" >
            {{ mer.color}} 
          </li>
       </ul>
      -->
       
    </div>
  
  </div>
  
  <p style="padding:3px;margin:0px;">
   <h4> {{ product.name }}</h4>
  <mt-picker :slots="slots" @change="onValuesChange" ></mt-picker>

  </p>
    
  
  
  <p style="text-indent:2em;">
  一边是棚架上满挂的晶莹剔透的葡萄，一边是采摘品尝过后停不下来的游人客商。1月13日至14日，省农业厅主办的海南热带葡萄品牌推介暨采摘季活动，吸引了大批电商、采购商以及市民参与，众人相继走进海口、三亚、东方的种植基地，享受采摘之乐，感受海南本地葡萄之鲜甜。
  </p>
  
  </div>
  
  
   
</template>
<script>
    import { Picker } from 'mint-ui';
    export default {
        data () {
            return {
                // 获取路由中的参数
                id: parseInt(this.$route.params.id),
                product: null,
                //商品属性一维
                mer_attr_level1:[],
                  //商品属性二维
                mer_attr_level2:[],
                slots:
				[
			    {
		          flex: 1,
		          values: ['红色', '白色'],
		          className: 'slot1',
		          textAlign: 'left'
		        }/*, {
		          divider: true,
		          content: '-',
		          className: 'slot2'
		        }*/, {
		          flex: 1,
		          values: ['XL', 'L', 'M', 'S', 'XS'],
		          className: 'slot3',
		          textAlign: 'left'
		        },
		        {
		          flex: 1,
		          values: ['300', '30', '120', '60', '50', '123'],
		          className: 'slot4',
		          textAlign: 'left'
		        }
			  ]


            }
        },
        methods: {
            getProduct () {
                
                //alert(this.$store.getters.products.length);
                const datas=sessionStorage.getItem('productList');
                //alert('---datas='+datas);
                const products=JSON.parse(datas);
                //alert('---products='+products);
                if(datas){
                    this.product = products.find(item => item.id === this.id);
                }else{
                   this.product = this.$store.getters.products.find(item => item.id === this.id);
                }
                
            },
            // 加入购物车
            handleAddToCart () {
                this.$store.commit('addCart', this.id);
            },
            
            onValuesChange(picker, values) { 
               alert(picker) ;
               alert(values) ;
            } ,
            
            fetchMer_attr_level1(){
            
                
                const datas=sessionStorage.getItem('productList');
               
                const products=JSON.parse(datas);
               
                if(datas){
                     
                    var obj=products.find(item => item.id === this.id);
                    
                    if(obj && obj.mer_attr_price){
                       var array=obj.mer_attr_price;
                       var filterd_array=[];
                       array.forEach(function(item){
                         
                            for (var key in item) {
                                   console.log(key);     //获取key值
                                   console.log(item[key]); //获取对应的value值
}
                       
                             });
                       
                    }
                    //this.mer_attr_level1 =
                    
                }
            
            }
            
            
        },
        mounted () {
            //alert('---mounted--');
            
            this.getProduct();
            
            this.fetchMer_attr_level1();
        }
    }
</script>
<style scoped>
    .product{
        margin: 5px;
        padding: 5px;
        background: #fff;
        border: 1px solid #dddee1;
        border-radius: 10px;
        overflow: hidden;
        width:40%;
    }
    .product-image{
    
        padding:5px;
        width: 250px;
        height:250px;
        display:block;
        float: left;
        text-align: center;
    }
    .product-info{
        background:red;
        width:60%;
        margin:5px;
        
        padding:5px;
       
        display:inline-block;
        
        text-align: left;
    }
    h4{height:25px;margin:0;padding:3px;}
    
</style>