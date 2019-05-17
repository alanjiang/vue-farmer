<template>
  <div>
    
    <mt-navbar  v-model="selected">
     <mt-tab-item id="订单">
        <div class="option">订单</div>
      </mt-tab-item>
      
      <mt-tab-item id="会员资料">
        <div class="option">会员资料</div>
      </mt-tab-item>
     
      <mt-tab-item id="地址簿">
        <div class="option">地址簿</div>
      </mt-tab-item>
    
      
    </mt-navbar>

  
    <mt-tab-container v-model="selected">
    
     <mt-tab-container-item id="订单">
        订单
      </mt-tab-container-item>
    
    
      <mt-tab-container-item id="会员资料">
      
      <p></p>
      
        <mt-cell :title="member_authen.country">
            <img slot="icon" :src="member_authen.headimgurl" width="90" height="90">
        </mt-cell>
       
     
      
      <div v-show="member.mobile">
        <mt-cell title="手机号">{{ member.mobile }} </mt-cell>
            
        <mt-cell title="认证时间">{{ member.regtime }}</mt-cell>
       
      </div>
       
        <div v-show="wechat_authen_show">
        
         <mt-cell title="会员认证"></mt-cell>
        
        
         
          <mt-field label="手机号" placeholder="填写您的手机号" v-model="mobile"></mt-field>
          <mt-field label="短信验证码" placeholder="短信验证码" type="code" v-model="code">
           <mt-button type="primary" :disabled="button_disabled" @click="fetch_code">{{ this.fetch_code_title }}</mt-button>
          </mt-field>
       
         <mt-button type="primary" @click="authen">认证会员</mt-button>
         
        
         
        
        </div>
        
        
      </mt-tab-container-item>
      
      <mt-tab-container-item id="地址簿">
        Hello
      <!--  地址簿中分列表和新增界面 --->
       <div v-show="!address_added_show">
        <mt-cell title="默认" is-link>
             <span>广东省广州市天河区天润路124号</span>
             <img slot="icon" src="../images/address_default.png" width="20" height="20">
            </mt-cell>
             <mt-cell title="收件地址1" is-link>
             <span>广东省广州市天河区天润路124号</span>
            
            </mt-cell>
             <mt-cell title="收件地址2" is-link>
             <span>广东省广州市天河区天润路124号</span>
           </mt-cell>
           
          <div style="text-align:center;"> 
            <mt-button type="primary" @click="showAddressAdd">新增收件地址</mt-button>
          </div>
       </div>
       
       <div v-show="address_added_show">
         
         <mt-field label="收件人" placeholder="请输入收件人姓名" v-model="name"></mt-field>
          <mt-field label="手机号" placeholder="请输入手机号" type="mobile" v-model="mobile"></mt-field>

          <mt-cell title="收件地址"></mt-cell>
          <v-distpicker></v-distpicker>

         <mt-field label="详细街道信息" placeholder="详细街道信息" type="detail" v-model="detail"></mt-field>
     
       </div>
       
           
      </mt-tab-container-item>
      
    </mt-tab-container>
  </div>
</template>

<script>

import {field,Toast} from 'mint-ui';
import $ from 'jquery';
export default {
  name: 'My',

  data() {
    return {
      selected: '会员资料',
      address_added_show: false,
      wechat_authen_show: false,
      mobile:'',
      code:'',
      member_authen:this.getMember_authen(),
      member:this.getMember(),
      count_down:90,
      curCount:0, 
      InterValObj:null,
      fetch_code_title: '获取验证码',
      button_disabled:false
      
      };
  },
  
  methods:{
      getMember () {
       
         if(localStorage.getItem("global.member")){
            console.log('>>>>global.member='+JSON.parse(localStorage.getItem("global.member")));
            return JSON.parse(localStorage.getItem("global.member"));
        }
        return {};
              
      },
      getMember_authen () {
       
         if(localStorage.getItem("global.member_authen")){
         
            console.log('>>>>global.member_authen='+JSON.parse(localStorage.getItem("global.member_authen")));
            return JSON.parse(localStorage.getItem("global.member_authen"));
        }
        return {};
              
      },
  
       
       fetch_code () {
       
          if(this.mobile == '' ){
             Toast({
  	    		  message: '请填写手机号',
  	    		  position: 'middle',
  	    		  duration: 500
  	    	     });
              return false;
          }
         
         var data={"mobile":this.mobile};
         
          var jsondata=JSON.stringify(data);
          
          var __this=this;
          $.ajax({
           type:"POST",
           contentType: "application/json; charset=utf-8",
           url:"http://localhost/dian/newsales/check_mobile", 
           data:jsondata,
           datatype: "json",
           success: function (message) 
		   {
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			   if(resCode == '0' ){
			     
			      __this.sendCode(__this.mobile); //向手机号发送一条验证码
			     
			   }else
			   {
			     Toast({
  	    		  message: '手机号不正确',
  	    		  position: 'middle',
  	    		  duration: 1000
  	    	     });
                 return false;
			   
			   }
			   
            },
            
            error: function (jqXHR, textStatus, errorThrown) 
		    {
               
			     alert("貌似出了点问题，请稍后再试"); 
            }
            
            
              
         });
            
       },
       
       authen () {
       
       
        var json={"mobile":this.mobile,"code":this.code,"id":this.member_authen.id};
		var jsondata=JSON.stringify(json);
		var __this=this;
         $.ajax({
           type:"POST",
           contentType: "application/json; charset=utf-8",
           url:"http://localhost/dian/newsales/register_mobile", 
           data:jsondata,
           datatype: "json",
           success: function (message) 
		   {
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			   if(resCode=='0') 
			   {
			        __this.curCount = __this.count_down;
					__this.InterValObj = window.setInterval(__this.setRemainTime, 1000); //启动计时器，1秒执行一次
			   }else 
			   {
				    Toast({
  	    		     message: '验证码发送失败',
  	    		     position: 'middle',
  	    		     duration: 500
  	    	         });
                     return false;
			   
			    }
			   
              
            },
            
            error: function (message) 
		    {
               
			    alert("貌似出了点问题，请稍后再试"); 
            }
              
         });
       
  
       },
       showAddressAdd () {
         this.wechat_authen_show=false;
         this.address_added_show=true;
       },
       showWechatAuthen () {
           this.selected='会员资料';
           
       },
       
       changePage(idx) {
            console.log(idx);
        },
        
       sendCode (mobile) {
       
        var json={"mobile":mobile};
		var jsondata=JSON.stringify(json);
		var __this=this;
         $.ajax({
           type:"POST",
           contentType: "application/json; charset=utf-8",
           url:"http://localhost/dian/business/send_sms_simple", 
           data:jsondata,
           datatype: "json",
           success: function (message) 
		   {
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			   if(resCode=='0') 
			   {
			        __this.curCount = __this.count_down;
					__this.InterValObj = window.setInterval(__this.setRemainTime, 1000); //启动计时器，1秒执行一次
			   }else 
			   {
				    Toast({
  	    		     message: '验证码发送失败',
  	    		     position: 'middle',
  	    		     duration: 500
  	    	         });
                     return false;
			   
			    }
			   
              
            },
            
            error: function (message) 
		    {
               
			    alert("貌似出了点问题，请稍后再试"); 
            }
              
         });
       
       },
       
    
    setRemainTime() {
	  if (this.curCount == 0) {                
		window.clearInterval(this.InterValObj);//停止计时器
		this.fetch_code_title='获取验证码';
		this.button_disabled=false;
	  }
	  else {
		this.curCount--;
		this.fetch_code_title='剩余'+this.curCount+'秒';
		this.button_disabled=true;
	 }
   }
       
        
        
  },
  
  created(){
              // 监听来自cart.vue中结算发出的事件：
             this.$bus.on('wechatShow', (val) => {
                    this.selected=val;
                    //出现微信登录界面
                    this.wechat_authen_show=true;
                    //alert('---this.this.wechat_authen_show='+this.wechat_authen_show);
                    
             });
             
             
       
     }
  
};
</script>

<style scoped>

 .option{
 
   font-weight:bold;font-size:1.1em;
   
   text-align:left;
 
 }
 
 .option a:active{
 
     border-bottom:2px solid blue;
 }
 
 
 
 

</style>
