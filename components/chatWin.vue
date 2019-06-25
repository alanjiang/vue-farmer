<template>

<div>


<hsy-dialog class="confirm" v-model="chat_win_visible" style="width:340px">
  <div slot="title" style="width:340px">客服聊天</div>
  <div slot="body" style="width:340px">
    <div>
    
       <div id="msg" class="msg-scroll">
       
            <p v-for="msg in msgList">
            
               <img :src="msg.headimgurl" width=30 height=30>&nbsp;
               <b><font color="red">{{msg.nickname}}</font></b>&nbsp;<font color="#636363">{{msg.sendtime}}</font>
               <mt-button  :msg="msg" type="primary" size="small" @click.native="answer(msg.unionid)">和我聊</mt-button><br>
               {{msg.msgtxt}}
            </p>
       
       </div>
       
       
      <p style="text-align:center;">  
            <mt-button type="primary" size="large"  @click.native="getHistoryMessages">加载历史消息</mt-button>
       </p> 
      <p v-if="this.cur_user">当前回复用户: {{this.cur_user.nickname }} &nbsp;<img :src="this.cur_user.headimgurl" width="30" height="30"></p>
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

import {Button,Field,Toast,Indicator} from 'mint-ui';
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
      
      selected_kefu_id:null,
      msgList:[],
      //选择回复的用户ID
      selected_user_id:null,
      
      cur_kefu:null,
      
      cur_user:null,
      //历史消息加载
      pageNo:1,
      totalPage:1
         
      }
  },
  
 
  methods: {
  
     //加载历史消息
     
      getHistoryMessages () { 
           
           Indicator.open({
           text: '历史消息加载中...',
           spinnerType: 'fading-circle'
          });
           
           this.msgList=[];//将当前消息列表清空
           var message={ 
                       "unionid":this.member_authen.unionid,
                       "nickname":this.member_authen.nickname,
                       "headimgurl":this.member_authen.headimgurl
                    }
                       
         
           var jsondata=JSON.stringify(message);
         
           var __this=this;
           $.ajax({
              type:"POST",
              contentType: "application/json; charset=utf-8",
              url:__this.domain+"/getHistoryMessages/"+__this.pageNo,
              data:jsondata,
              datatype: "json",
              success: function (message) 
		      {  
		       
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			   Indicator.close();
			   if(resCode == '0' ){
			  
			     message.results.forEach(t =>{
			        __this.msgList.push(t);
			     });
			     
			      
			      __this.pageNo=message.pageNo;
			      __this.totalPage=message.totalPage;
			      
			      __this.$nextTick(() => {
                    var msgDiv=document.getElementById("msg");
                    msgDiv.scrollTop = msgDiv.scrollHeight+5;
                  });
			      
			   }else
			   {
			     
			     Toast({
  	    		  message: '历史消息未成功加载',
  	    		  position: 'middle',
  	    		  duration: 1000
  	    	      });
			   }
			   
            },
            
            error: function (jqXHR, textStatus, errorThrown) 
		    {
		         Indicator.close();
			     Toast({
  	    		  message: "貌似有点问题",
  	    		  position: 'middle',
  	    		  duration: 1000
  	    	     });  
            }
             
         });
                
      },
     //选择聊天的用户ID
     answer (id) {
    
       this.selected_user_id=id;
       //说明是客服的点击
       if(this.selected_kefu_id == this.member_authen.unionid){
          this.getUser(id);
       }
       
     },
     
     //广播消息
     broadCast (wsMessage) {
      
      
        var json=JSON.parse(wsMessage);
        
        if(json.unionid == this.member_authen.unionid || json.destination_unionid == this.member_authen.unionid)
        {
           this.msgList.push(json);
           
           this.$nextTick(() => {
               var msgDiv=document.getElementById("msg");
               msgDiv.scrollTop = msgDiv.scrollHeight+5;
          });
           
        }
     },
     
     //打开客服咨询窗口，连接socket时发送一条问候消息,消息仅客服与发送的用户可以可见
     connectMsg () {
     
         var message={ "destination_unionid":this.selected_kefu_id,
                       "unionid":this.member_authen.unionid,
                       "nickname":this.member_authen.nickname,
                       "headimgurl":this.member_authen.headimgurl,
                       "msgtxt":this.ws_msg};
         //先加载历史消息
         this.stompClient.send("/app/hello", {}, JSON.stringify(message));
     
     },
     
     leftMsg () {
     
         var message={ "destination_unionid":this.selected_kefu_id,
                       "unionid":this.member_authen.unionid,
                       "nickname":this.member_authen.nickname,
                       "headimgurl":this.member_authen.headimgurl,
                       "msgtxt":"["+this.member_authen.nickname+"]中断了聊天,暂时离开"};
       
         this.stompClient.send("/app/hello", {}, JSON.stringify(message));
         
     },
     //如果是客服回复，则必须选择一个用户进行进行回复
     sendMsgToKefuAndMyself () {
     
          if(!this.ws_msg){
             Toast({
  	    		  message: '发送内容不可为空',
  	    		  position: 'middle',
  	    		  duration: 500
  	    	     });
  	    	     
  	    	     return false;
          }
          
           var message={};
           
           //判断是用户的身份，普通用户和客服
           
           if(this.member_authen.unionid == this.selected_kefu_id){
           
              if(this.selected_user_id == null ){
              
                  Toast({
  	    		  message: '请选择一个聊天的用户',
  	    		  position: 'middle',
  	    		  duration: 500
  	    	     });
  	    	     
  	    	     return false;
              }else{
              
                message={ 
                       "destination_unionid":this.selected_user_id,
                       "unionid":this.member_authen.unionid,
                       "nickname":this.member_authen.nickname,
                       "headimgurl":this.member_authen.headimgurl,
                       "msgtxt":this.ws_msg};
              
              }
              
           
           }else{
           
             message={ 
                       "destination_unionid":this.selected_kefu_id,
                       "unionid":this.member_authen.unionid,
                       "nickname":this.member_authen.nickname,
                       "headimgurl":this.member_authen.headimgurl,
                       "msgtxt":this.ws_msg};
         
            }
         
           
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
     
        this.leftMsg();
     
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
     
     },
     
     //获取当前用户cur_user对象
     getUser (userid) {
     
        
         this.msgList.forEach(t=>{
           
            if(t.unionid == userid ){
             
               this.cur_user=t;
              
            }
         });
     },
     //获取当前客服cur_kefu对象
     getKefu (kefuid) {
     
     
         this.msgList.forEach(t=>{
           
            if(t.unionid == kefuid ){
             
               this.cur_kefu=t;
              
            }
         });
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
                 this.msgList=[];
                 this.disConnectSocket();
                 
              }
           }
      }
    },
  
 
  
  created () {
 
      // 监听来自kefu.vue中打开聊天窗口的事件 
      this.$bus.on('open_chat_win', (val) => {
         
        
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
          },function(err){
                  Toast({
  	    		  message: "与服务器建立连接失败，请稍后再试",
  	    		  position: 'middle',
  	    		  duration: 1000
  	    	       });
              
              
           });
          
          
          
          //订阅服务器发给点到点用户的消息
          __this.stompClient.subscribe('/user/queue/message', function (socketMessage) {
               
                
                 __this.broadCast(socketMessage.body);
          });
          
             
             __this.connectMsg();
              
          
          });
          //结束订阅服务器发给点到点用户的消息        
                   
            
                   
         });
         
         // 结束监听来自kefu.vue中打开聊天窗口的事件 
             
 
          this.$bus.on('memberAuthenChange', (val) => {
               
               this.member_authen=val;
               
                
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


.chat-button { /* 按钮美化 */
	width: 120px; /* 宽度 */
	height: 30px; /* 高度 */
	border-width: 0px; /* 边框宽度 */
	border-radius: 3px; /* 边框半径 */
	background: #1E90FF; /* 背景颜色 */
	cursor: pointer; /* 鼠标移入按钮范围时出现手势 */
	outline: none; /* 不显示轮廓线 */
	font-family: Microsoft YaHei; /* 设置字体 */
	color: white; /* 字体颜色 */
	font-size: 13px; /* 字体大小 */
}
.chat-button :hover { /* 鼠标移入按钮范围时改变颜色 */
	background: #5599FF;
}

</style>
