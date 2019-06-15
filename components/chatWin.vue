<template>

<div>


<hsy-dialog class="confirm" v-model="chat_win_visible" style="width:350px">
  <div slot="title" style="width:350px">客服聊天</div>
  <div slot="body" style="width:350px">
    <div>
    
       <div id="msg" class="msg-scroll"></div>
       <mt-field label="留言"  type="textarea"  v-model="ws_msg" ></mt-field>
       <p style="text-align:center;">  
            <mt-button type="primary" size="large"  @click.native="sendMsgToKefuAndMyself">发送</mt-button>
       </p> 
       <p>
         技术支持：汗牛科技（广州）有限公司
       </p>
    </div>
    <div>
    </div>
  </div>
</hsy-dialog>
</div>
</template>


<script>

import {Button,Field,Toast} from 'mint-ui';
import constants from '../utils/constants.js';
import SockJS from  'sockjs-client';
import  Stomp from 'stompjs';
import $ from 'jquery';
export default {
  data() {
    return {
      chat_win_visible:false,
      domain: constants.domain,
      ws_msg:null,
      stompClient:null,
      member_authen:null,
      selected_client_id:null,
      selected_kefu_id:null,       
    }
  },
  methods: {
      
     
     broadCast (wsMessage) {
      
        var json=JSON.parse(wsMessage);
        var tmp= document.createElement("p");
        tmp.innerHTML='<img src="'+json.headimgurl+'" width=30 height=30 >&nbsp;<b><font color="red">'+json.nickname+'</font></b>&nbsp;<font color="#636363">'+json.sendtime+'</font><br>'+json.msgtxt;
        var msgDiv=document.getElementById("msg");
        msgDiv.appendChild(tmp);
        msgDiv.scrollTop = msgDiv.scrollHeight;
     
     },
     
     sendMsg () {
     
      var message={   "unionid":this.member_authen.unionid,
                       "nickname":this.member_authen.nickname,
                       "headimgurl":this.member_authen.headimgurl,
                       "msgtxt":this.ws_msg};
        
       
         this.stompClient.send("/app/hello", {}, JSON.stringify(message));
     
     },
     
     sendMsgToKefuAndMyself () {
     
          if(!this.ws_msg){
             Toast({
  	    		  message: '发送内容不可为空',
  	    		  position: 'middle',
  	    		  duration: 500
  	    	     });
  	    	     
  	    	     return false;
          }
          
           //alert('--this.selected_kefu_id='+this.selected_kefu_id);
         
           var message={ 
                       "destination_unionid":this.selected_kefu_id,
                       "unionid":this.member_authen.unionid,
                       "nickname":this.member_authen.nickname,
                       "headimgurl":this.member_authen.headimgurl,
                       "msgtxt":this.ws_msg};
         
          var jsondata=JSON.stringify(message);
          //alert('--jsondata='+jsondata);
          var __this=this;
          //通过http触发服务器向/user/{unionid}/queue/message订阅者发送消息
          $.ajax({
           type:"POST",
           contentType: "application/json; charset=utf-8",
           url:__this.domain+"/sendToUser", 
           data:jsondata,
           datatype: "json",
           success: function (message) 
		   {
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			   if(resCode == '0' ){
			       __this.ws_msg='';
			   }else
			   {
			     Toast({
  	    		  message: resMsg,
  	    		  position: 'middle',
  	    		  duration: 1000
  	    	     });
  	    	     
  	    	    
                 return false;
			   
			   }
			   
            },
            
            error: function (jqXHR, textStatus, errorThrown) 
		    {
               
               Toast({
  	    		  message: "消息未发送成功，请检查网络",
  	    		  position: 'middle',
  	    		  duration: 1000
  	    	     });
			     
            }
            
            
              
         });
     
     },
     
     
     //清除子节点 
     clearDiv (div) {
        var msgDiv=document.getElementById(div);
        while(msgDiv.hasChildNodes()){
            msgDiv.removeChild(msgDiv.firstChild);
         }
     },
     
     disConnectSocket () {
     
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
     
     }
     
     
     
  },
  
 
     watch: {
     
      //关闭窗口，清除上次的聊天记录
      chat_win_visible (newValue, oldValue) {
           if(oldValue){
              if(!newValue){
                 Toast({
  	    		  message: "感谢您的访问，再见!",
  	    		  position: 'middle',
  	    		  duration: 1000
  	    	     });
                 this.clearDiv('msg');
                 this.disConnectSocket();
                 
              }
           }
      }
    },
  
 
  
  created () {
 
      // 监听来自kefu.vue中打开聊天窗口的事件 
      this.$bus.on('open_chat_win', (val) => {
         
         // alert('--val='+val);
         this.selected_kefu_id=val;
         //打开聊天窗口 
         this.chat_win_visible=true;
         var socket = new SockJS('/gs-guide-websocket');
         this.stompClient = Stomp.over(socket);
        
         //建立socket连接
         var __this=this;
         //将unionid作为用户标识
         __this.stompClient.connect({"name":__this.member_authen.unionid}, function (frame) {
         //订阅有新人加入消息,不需要经过服务器处理
          __this.stompClient.subscribe('/topic/greetings', function (socketMessage) {
                
                 __this.broadCast(socketMessage.body);
          });
          
          //订阅服务器发给点到点用户的消息
          __this.stompClient.subscribe('/user/queue/message', function (socketMessage) {
               
                
                 __this.broadCast(socketMessage.body);
          });
          
             
             __this.sendMsg();
              
          
          });
                   
                   
                   
         });
             
          
          
          this.$bus.on('memberAuthenChange', (val) => {
               
               this.member_authen=val;
               //alert('---member='+JSON.stringify(this.member_authen));
                
         });    
  
  }
  
  
  
}
</script>
<style scoped>
.hsy-dialog .main .title .content>* {
  width: 95%;
  min-width: 85px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.msg-scroll{

   maxHeight: 260px;
   height:260px;
   overflow:auto;

}
</style>
