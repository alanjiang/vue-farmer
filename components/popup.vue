<template>

<mt-popup
  v-model="popupShow"
  popup-transition="popup-fade"
  position="top" name="hello"
  >
  
  <p> Hello</p>
  
</mt-popup>


</template>

<script>

import { Popup } from 'mint-ui';



export default{

    name:'Popup',
    
    data() {
    
      return {
      
       popupShow:true
      
      } 
    
    }


}

</script>