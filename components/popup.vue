<template>


 <div class="popup-container">
 
<mt-popup 
  v-model="popupShow"  
    popup-transition="popup-fade">
    
<h4>{{ item.name }}</h4> 
   
<p class="img">
<img  slot="icon" :src="item.image" width="120" height="120">
</p> 
<h4>价格：¥ <font color="red">{{ item.price }}</font> </h4>
<div v-show="scale"> 
<h4>己选择型号: <font color="red"> {{ selected }}</font></h4>

<h4 v-if="this.item.remain == 0"><font color="red">已售完</font></h4> 
<h4 v-else>库存：{{this.item.remain}}</h4>

<mt-picker :slots="slots"  :visible-item-count="3" 
    popup-transition="popup-fade" modal="true" 
    closeOnClickModal="true" 
    @change="onValuesChange">
  </mt-picker>
</div>    
    
 
<!-- 
<mt-cell>
 数量：
<img src="../images/substract.png" style="cursor:pointer;" @click="numSub">&nbsp;<font color="red">{{ num }}</font>&nbsp;
<img src="../images/add.png" style="cursor:pointer;" @click="numAdd"></span>
</mt-cell>
<mt-cell style="padding:10px;text-align:center;">
 <mt-button size="small" style="cursor:pointer;" type="primary" @click.native="addToCart">加入购物车</mt-button>
</mt-cell>
-->
<mt-button size="large" style="cursor:pointer;" type="primary" @click.native="addToCart">加入购物车</mt-button>


</mt-popup>

 </div>
</template>

<script type="text/babel">

import { Popup,Button,Checklist,Cell,Picker,Toast  } from 'mint-ui';

export default{

    name:'PopupItem',
    
    data() {
    
      return {
       buttonBottom: 50,
       popupShow:false,
       scale:false,
       num:1,//商品选购的数量
       value:null,
       item:{},
       selected:'', //显示己选择的规格值：
       mer_attr_price:[]
      } 
    
    },
    
    computed:{
    
    slots(){
    
     
    let dataSlots=[ {
		           flex: 1,
		           values:this.mer_attr_price,
		           className: 'slot1',
		           textAlign: 'left'
		     }
		        
		        
	    ];
    
        return dataSlots;
    
    }
		
       
    
    },
    
    methods:{
    
        get_mer_attr_price(){
           
           return this.mer_attr_price;
        },
        //when click add to cart, hide this box
        addToCart:function(){
          if(this.popupShow){
             this.popupShow=false;
          }
          
          //调用main.js中的addCart方法
          
          if(this.item.remain == 0){
           Toast({
                message: '抱歉, 当前商品已售完。',
                iconClass: 'icon icon-success'
                });
             return;
          
          }
                
          var params={'id':this.item.id,'symbol':this.item.symbol};
              
          
          Toast({
                    message: '成功加入购物车',
                    iconClass: 'icon icon-success'
                    });
                
                
          
          this.$store.commit('addCart', params);
              
          
          
          
          
          
          
        },
        check:function(){
        
           alert('---'+this.value);
        },
        
        numAdd:function(){
           this.num ++;
        },
        numSub:function(){
           if (this.num==1) return;
           this.num --;
        },
        onValuesChange(picker, values) { 
                var datas=localStorage.getItem('productList');
                var products=JSON.parse(datas);
                var obj=products.find(item => item.id === this.item.id);
                if(obj){
                   
                   if(obj.mer_attr_price){
                    
                    obj.mer_attr_price.forEach(t=>{
                        if(t.label == values){
                           
                           this.item.price=t.price;
                           this.item.remain=t.num;
                           this.selected=t.label;
                           this.item.symbol=t.symbol;
                           return;
                        }
                    });
                     
                      
                   }
                }
                
                
            } 
    },
    
    created(){
     //resetPopShow is event from productive $emit 
     this.$bus.on('resetPopShow', (val) => {
        
         this.item=val;
         this.popupShow=true;
         
         var temArray=[];
         if(val.mer_attr_price){
           
            val.mer_attr_price.forEach(function(it){
                temArray.push(it.label);
            });
            
            this.mer_attr_price=temArray;
            this.scale=true;
            
         }else{
           this.scale=false;
         }
         
         
     });
  
  },
   mounted() {
     
    } 
    
    
     


}

</script>

<style scoped>
    
    .popup-container{
       
        width: 450px;
        border-radius: 18px;
        padding: 10px 10px;
        transform: translate(-50%, 0);
        background:red;
      }
   .mint-popup  {
        width: 400px;
        border-radius: 8px;
        padding: 10px 10px;
        transform: translate(-50%, 0);

        
      }
 
   .img{
   
     text-align:center;
     
   }
     
 }

<style>