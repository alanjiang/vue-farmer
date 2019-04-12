<template>


<p>



<mt-popup
  v-model="popupShow"  class="popup-wrapper"
    popup-transition="popup-fade">
    
   
   
   
   <mt-cell title="小白菜" >
     
  
    <img  slot="icon" src="../images/c10.jpg" width="150" height="150">
  
</mt-cell> 
    
    
    <mt-cell>
    <mt-radio
  title="规格选择" align="left" v-model="value" @change="check"
 
  :options="this.options">
</mt-radio>

</mt-cell>



<mt-cell>
 数量：
<img src="../images/substract.png" style="cursor:pointer;" @click="numSub">&nbsp;{{ num }}&nbsp;
<img src="../images/add.png" style="cursor:pointer;" @click="numAdd"></span>
</mt-cell>

<mt-cell style="padding:10px;text-align:center;">
 <mt-button size="small" style="cursor:pointer;" type="primary" @click.native="popHide">加入购物车</mt-button>
</mt-cell>


</mt-popup>


</p>

</template>



<script>

import { Popup,Button,Checklist,Cell  } from 'mint-ui';



export default{

    name:'PopupItem',
    
    data() {
    
      return {
      
       popupShow:false,
       num:1,
       value:null,
       options:[
       
       {label:'颜色：红色，尺寸：L，库存：300',value:1}, 
       
       {label:'颜色：红色，尺寸：M，库存：300',value:2}
       
       ]
       
      } 
    
    },
    methods:{
    
        //when click add to cart, hide this box
        popHide:function(){
          this.popupShow=false;
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
    },
    
    created(){
     //resetPopShow is event from productive $emit 
     this.$bus.on('resetPopShow', (val) => {
         console.log('--from productive.vue component---'+val);
         this.popupShow=true;
     });
  
  },
    
     


}

</script>

<style scoped>

.popup-wrapper{
     triangle: 10px top #fff;
     padding:5px 5px;
     border-radius:15px 0;
     
}

 .cart-control-minus,
 .cart-control-add{
        display: inline-block;
        margin: 0 4px;
        width: 24px;
        height: 24px;
        line-height: 22px;
        text-align: center;
        background: #f8f8f9;
        border-radius: 50%;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        cursor: pointer;
    }
.cart-count{
        width: 35%;
    }
 ul li{
    list-style:none;
    
 }
 
 .round{
   
     width:300px;
     height:300px;
     padding:5px 5px;
     margin:5px 5px 5px 5px;
     border-radius:15px;
     background:gray;
 
 }
<style>