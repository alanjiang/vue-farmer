<template>
    <div>
       
       
       
       
       <mt-cell v-if="kefuList.length" v-for="kefu in kefuList"   :title="'微信号:'+kefu.username+''"  :label="'电话：'+kefu.mobile+''"  is-link>
            <img slot="icon" :src="kefu.headimgurl" width="80" height="80">
            <mt-button type="primary" size="small"  @click="openChatWin">咨询</mt-button>
       
        </mt-cell> 
       
        
        
        <p v-else>
          该商家暂未设置客服人员
        </p>
      
       
       
       
       
    </div>
</template>
<script>
    import {Cell, Toast} from 'mint-ui';
    import $ from 'jquery';
    import constants from '../utils/constants.js';
    
    export default {
      
      name: 'Kefu',
      data () {
        return {
             domain: constants.domain,
             kefuList:[]
            }
       },
        
     methods: {
           getKefuList () { 
           
           var __this=this;
           $.ajax({
              type:"GET",
              contentType: "application/json; charset=utf-8",
              url:__this.domain+"/sales/getKefus",
              datatype: "json",
              success: function (message) 
		      {  
		       //alert('---hello--');
		       //alert('---resMsg='+message.resCode);
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			   if(resCode == '0' ){
			   
			    //alert('---message.results='+message.results);
			      __this.kefuList=message.results;
			      
			   }else
			   {
			     Toast({
  	    		  message: resMsg,
  	    		  position: 'middle',
  	    		  duration: 1000
  	    	      });
			   }
			   
            },
            
            error: function (jqXHR, textStatus, errorThrown) 
		    {
                
			     Toast({
  	    		  message: "貌似有点问题",
  	    		  position: 'middle',
  	    		  duration: 1000
  	    	     });
  	    	     
            }
            
            
              
         });
                
      },
      
      openChatWin () {
      
          //alert('--websocket msg send--');
          
          this.$bus.emit('open_chat_win','');
 
      }
      
      
  },       
        
        
        mounted(){
           
         
        },
        
          created(){
             
             this.getKefuList();
       
          }
        
        
        
  }
</script>
<style scoped>
    
</style>