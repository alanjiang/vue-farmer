<template>

<p>

<mt-button type="danger" @click.native="popClick">选取型号</mt-button>


<mt-popup
  v-model="popupShow"
    popup-transition="popup-fade">
  <div style="width:450px;height:300px;">
    <mt-checklist
  title="checkbox list"
  
  :options="options">
</mt-checklist>
 </div>
</mt-popup>

</p>

</template>

<script>

import { Popup,Button,Checklist } from 'mint-ui';



export default{

    name:'Popup',
    
    data() {
    
      return {
      
       popupShow:false,
       options:["A","B","C"]
       
      } 
    
    },
    methods:{
    
        popClick:function(){
        
          this.popupShow=true;
        }
    }
    
     


}

</script>