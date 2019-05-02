<template>
  <div>
  
  <div class="image-container">
  
   <img src="../images/wenbixia.jpg" width="150" height="150">
  
  </div>
  
  <p>颜色</p>
  
  <ul>
  <li v-for="(item,index) in colors" class="label" 
   :class="{label_active: selected == index}"  @click="chooseItem(index)">
      {{ item }} 
  </li>
  </ul>
  <div class="clear"></div>
  
  <p>尺寸</p>
 
  <ul>
  <li v-for="(item,index) in sizes" class="label" 
   :class="{label_active: selected2 == index}"  @click="chooseItem2(index)">
      {{ item }} 
  </li>
  </ul>
  
  <div class="clear"></div>
  
  
  
  <!--
  <mt-button type="primary" size="normal" @click="sayHello">SayHello</mt-button>
  -->    
     
  </div>
  
</template>

<script>
  export default {
    name:'myContent',
    data() {
      return {
      
          colors:["red","yellow","black"],
          selected:-1,
          sizes:["36","37","38"],
          selected2:-1 
      }
    },
    
    methods:{
    
      chooseItem(index){
        
         this.selected=index;
      },
      chooseItem2(index){
         
         this.selected2=index;
      },
      sayHello(){
      
       alert("sayHello");
      
      }
    
    }
  }
</script>
<style>
p
{
 color:#000

}
ul{
  padding:5px 5px;
}
li {
  
   width:90px;
   height:25px;
   padding:2px 2px;
   text-align:center;
   float:left;
   list-style:none;
   margin:3px 2px;

}

 .label{
    
    border-radius:8px;
    color:#000;
    background:#fff;
 }
 
 .label_active{
     color:red;
     border-radius:8px;
     border:1px solid red;
     background:#fff;
 }

.clear{

   width:100%;
   height:1px;
   background:#fff;
   display:block;
   clear:both;
}

.image-container{

   width:100%;
   
   margin:3px;
   
   background:#fff;
   
   text-align:left;
}
</style>