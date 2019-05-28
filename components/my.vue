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
       <p></p>
       <div v-show="show_order_list">
        <mt-cell @click.native="detail(order.id,order.total_price)"  v-for="order in orders"  :title="order.order_no" is-link>
            <span style="color: red;">总价：¥ {{ order.total_price }}</span> 
            
            <span  v-show="order.order_status == 1">待付款</span>
            <span  v-show="order.order_status == 2">己付款</span>
        </mt-cell>
      </div>
        <div v-show="show_order_detail" >
         <p> 
         <mt-button type="primary" size="large" @click.native="backOrderList"> 返回订单列表 </mt-button>
        </p>  
        
         <mt-cell title="新增收件地址" is-link @click.native="address_add">
            <img slot="icon" src="../images/address_add.png">
        </mt-cell> 
         
         <p v-for="mer in mers" :key="mer.merid">
          <mt-cell  :title="mer.mername">
            <img slot="icon" :src="mer.merpic" width="90" height="90">
            <span style="color:red">¥{{ mer.itemprice}}</span>X <span>{{ mer.quantity}}</span>
           <span v-show="mer.unit"> 单位：{{ mer.unit}}</span>  
          </mt-cell> 
          
          <mt-cell>
            <span v-show="mer.label">规格：{{mer.label}}| </span>
          
            <span style="color:red">小计：¥{{ mer.price}}</span>
           </mt-cell>
         </p>
         
        <mt-cell title="订单总额">
             
            
        <span style="color:red">¥{{ cur_total_price}}</span>
             
          </mt-cell>
          
           <mt-cell >
            <img slot="icon" src="../images/wechatpay.jpg">
           
            <mt-button type="primary" size="normal" :disabled="wechat_pay_btn_disabled"  @click.native="unifyOrder">去支付</mt-button>
           
          </mt-cell> 
          
           <mt-button type="primary" size="small" @click.native="backOrderList"> 返回订单列表 </mt-button>
          
        </div>
        
          
          
       
        
            
            
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
          <mt-field label="短信验证码" placeholder="短信验证码" type="code" v-model="code" @blur.native.capture="authen"></mt-field>
          >
           <mt-button type="primary" :disabled="button_disabled" @click="fetch_code">{{ this.fetch_code_title }}</mt-button>
          </mt-field>
       
         <mt-button type="primary" :disabled="authen_button_disabled" @click="authen">认证会员</mt-button>
         
        </div>
        
        <div v-show="mobile_binded">
        
        <mt-cell title="会员手机号已验证"></mt-cell>

        
        </div>
        
        
      </mt-tab-container-item>
      
      <mt-tab-container-item id="地址簿">
        <p></p>
      <!--  地址簿中分列表和新增界面 --->
       <div v-show="show_address_list">
        <!-- 
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
        -->   
          <div style="text-align:center;"> 
            <mt-button type="primary" @click="showAddressAdd">新增收件地址</mt-button>
          </div>
       </div>
       
       <div v-show="show_address_add">
         
         <mt-field label="收件人" placeholder="请输入收件人姓名" v-model="rec_name"></mt-field>
          <mt-field label="手机号" placeholder="请输入手机号" type="mobile" v-model="rec_mobile"></mt-field>

          <mt-cell title="收件地址"></mt-cell>
          <v-distpicker @selected="areaSelected"></v-distpicker>

         <mt-field label="详细街道信息" placeholder="详细街道信息" v-model="rec_detail"></mt-field>
         
         <mt-button type="primary" size="large"  @click="address_save">保存</mt-button>
         
       </div>
       
           
      </mt-tab-container-item>
      
    </mt-tab-container>
  </div>
</template>

<script>

import {field,Toast,Indicator} from 'mint-ui';
import $ from 'jquery';

import datas from '../utils/table.js';
export default {
  name: 'My',

  data() {
    return {
     
      selected: '订单',
      address_added_show: false,
      wechat_authen_show: false,
      mobile:'',
      code:'',
      member_authen:{},
      member:{},
      count_down:90,
      curCount:0, 
      InterValObj:null,
      fetch_code_title: '获取验证码',
      button_disabled:false,
      authen_button_disabled:false,
      domain:'http://www.dianliaome.com',
      //已绑定手机
      mobile_binded:true,
      //近1天的订单列表
      orders:[],
      
      show_order_list:true,
      show_order_detail:false,
      //订单中的商品清单
      mers:[],
      //当前订单对象
      cur_order:{},
      cur_total_price:null,
      
      //统一下单位的参数 
      unifiy_order:{appId:null, nonceStr:null, package:null,
                    signType:'MD5', paySign:null, total_fee:null
                    
                   },
                   
       wechat_pay_btn_disabled:false,
                   
       //收件地址
       rec_name:null,
       rec_mobile:null,
       rec_detail:null,
       rec_province: null,
       rec_city:null,
       rec_district:null,
       
       //地址列表显示
       show_address_list: true,
       //新增地址表单显示
       show_address_add:  true
      
      };
  },
  
  methods:{
  
   areaSelected(data) {
      //alert(data.province.value + ' | ' + data.city.value + ' | ' + data.area.value);
      this.rec_province=data.province.value;
      this.rec_city=data.city.value;
      this.rec_district=data.area.value;
   },
  
  
    //点击切换地址新增
    
   address_add () {
   
     if(!this.cur_order.rec_address_id){
     
         this.selected='地址簿';
     }
       
   
   }, 
    
    //提交新增地址按钮,新增成功后，刷新地址列表
   address_save () {
     
       if (!this.rec_name){
           Toast({
  	    		     message: '收件人未填写',
  	    		     position: 'middle',
  	    		     duration: 1000
  	      });
	      return false;
       }
       if (!this.rec_mobile){
           Toast({
  	    		     message: '收件人手机未填写',
  	    		     position: 'middle',
  	    		     duration: 1000
  	      });
	      return false;
       }
       
       if (!this.rec_province || !this.rec_city || !this.rec_district){
           Toast({
  	    		     message: '收件人地址未填写完整',
  	    		     position: 'middle',
  	    		     duration: 1000
  	      });
	      return false;
       }
       
       if (!this.rec_detail){
           Toast({
  	    		     message: '详细街道信息未填写',
  	    		     position: 'middle',
  	    		     duration: 1000
  	      });
	      return false;
       }
       
      
       
       
       var json={"id":this.rec_id,"name": this.rec_name,
    		   "mobile":this.rec_mobile ,"province":this.rec_province,"city": this.rec_city,"district":this.rec_district,"detail":this.rec_detail,
    		   
    		    "member_id": this.member.id, "union_id":this.member_authen.unionid,"type":this.member_authen.type}
     
       var __this=this;
       var jsondata=JSON.stringify(json);
       //alert('---jsondata='+jsondata);
       
       Indicator.open({
           text: '请求提交中...',
           spinnerType: 'fading-circle'
       });
           $.ajax({
           type:"POST",
           contentType: "application/json; charset=utf-8",
           url:__this.domain+"//address/update",
           data:jsondata,
           datatype: "json",
           success: function (message) 
		   {
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			   Indicator.close();
			    Toast({
  	    		     message: resMsg,
  	    		     position: 'middle',
  	    		     duration: 1000
  	    	     });
			   if(resCode=='0')
			   {
				   __this.show_address_add=false;
                   __this.show_address_list=true;
				   
			   }else{
				  
				 
			   }
              
            },
            
            error: function (message) 
		    {
               Indicator.close();
			     Toast({
  	    		     message: '服务器异常',
  	    		     position: 'middle',
  	    		     duration: 1000
  	    	     });
  	    	    
            }
              
         });
   
   },  
     
   //统一下单 
   unifyOrder () {
	
	if(!this.cur_order.rec_address_id){
	   Toast({
  	    		     message: '收件地址未填写',
  	    		     position: 'middle',
  	    		     duration: 1000
  	   });
	   return false;
	}
	Indicator.open({
           text: '支付中...',
           spinnerType: 'fading-circle'
    });
    this.wechat_pay_btn_disabled=true;
    var json={"out_trade_no":this.cur_order.order_no,"total_fee": this.cur_order.total_price,
    		   "openid":this.member_authen.openid ,"orderid":this.cur_order.id,"shopid": this.cur_order.shopid}
     
     var __this=this;
     var jsondata=JSON.stringify(json);
           $.ajax({
           type:"POST",
           contentType: "application/json; charset=utf-8",
           url:__this.domain+"/wechat/pay/unifyOrder",
           data:jsondata,
           datatype: "json",
           success: function (message) 
		   {
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			   if(resCode=='0')
			   {
				   __this.unifiy_order.appId=message.appid;
				   __this.unifiy_order.timeStamp=message.timeStamp;
				   __this.unifiy_order.nonceStr=message.nonce_str;
				   __this.unifiy_order.package="prepay_id="+message.prepay_id;
				   __this.unifiy_order.signType="MD5";
				   __this.unifiy_order.paySign=message.sign;
				   __this.unifiy_order.total_fee=message.total_fee;         
				   __this.envWechatPay();
				   
			   }else{
				  Indicator.close();
				  Toast({
  	    		     message: resMsg,
  	    		     position: 'middle',
  	    		     duration: 1000
  	    	     });
			   }
              
            },
            
            error: function (message) 
		    {
               Indicator.close();
			     Toast({
  	    		     message: '服务器异常',
  	    		     position: 'middle',
  	    		     duration: 1000
  	    	     });
  	    	    this.wechat_pay_btn_disabled=false;
            }
              
         });	 
  },

  // 初始微信支付环境
  envWechatPay () {
  
      if (typeof WeixinJSBridge == "undefined"){
	   if( document.addEventListener ){
	       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	   }else if (document.attachEvent){
	       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
	       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	   }
	}else{
	   this.wechatPay();
	}
  },

  wechatPay () {
       var __this=this;
	   WeixinJSBridge.invoke(
	       'getBrandWCPayRequest', {
	           "appId":__this.unifiy_order.appId,       
	           "timeStamp":__this.unifiy_order.timeStamp,           
	           "nonceStr": __this.unifiy_order.nonceStr, 
	           "package":__this.unifiy_order.package,     
	           "signType":__this.unifiy_order.signType,
	           "paySign":__this.unifiy_order.paySign
	       },
	       function(res){    
	    	   
	           if(res.err_msg == "get_brand_wcpay_request:ok" ) 
	           {
					
					 Indicator.close();
					 Toast({
  	    		     message: '支付成功',
  	    		     position: 'middle',
  	    		     duration: 1000
  	    	         });
	        	     //__this.quryPayResult();
	           }  
	       }
	   ); 
	},
	
      //返回订单列表
      backOrderList () {
      
         //订单详情不显示
          this.show_order_detail=false;
          //订单列表显示
          this.show_order_list=true;
      },
       //获取订单详情 
       detail (id,total_price) {
         

          //订单详情显示
          this.show_order_detail=true;
          //订单列表不显示
          this.show_order_list=false;
          var data={"id":id,"total_price":total_price};
         
          var jsondata=JSON.stringify(data);
           
           Indicator.open({
           text: '订单获取中...',
           spinnerType: 'fading-circle'
        });
          var __this=this;
          $.ajax({
           type:"POST",
           contentType: "application/json; charset=utf-8",
           url:__this.domain+"/newsales/getOrderDetail", 
           data:jsondata,
           datatype: "json",
           success: function (message) 
		   {
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			   Indicator.close();
			   if(resCode == '0' ){
			     
			      __this.mers=message.mers;
			      __this.cur_total_price=message.total_price;
			      __this.cur_order=message.order;
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
                Indicator.close();
			     Toast({
  	    		  message: "貌似有点问题",
  	    		  position: 'middle',
  	    		  duration: 1000
  	    	     });
  	    	     
            }
            
            
              
         });
            
       },
      fetch_orders () {
         
          var __this=this;
          $.ajax({
           type:"GET",
           contentType: "application/json; charset=utf-8",
           url:__this.domain+"/newsales/getOrderList", 
          
           datatype: "json",
           success: function (message) 
		   {
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			   
			   if(resCode == '0' ){
			     
			      __this.orders=message.results;
			     
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
       
       fetch_code () {
          //点击获取验证码后，按钮不可点击。
          this.button_disabled=true;
          if(this.mobile == '' ){
             Toast({
  	    		  message: '请填写手机号',
  	    		  position: 'middle',
  	    		  duration: 500
  	    	     });
  	    	  this.button_disabled=false;
              return false;
          }
         
          var data={"mobile":this.mobile};
         
          var jsondata=JSON.stringify(data);
          
          var __this=this;
          $.ajax({
           type:"POST",
           contentType: "application/json; charset=utf-8",
           url:__this.domain+"/newsales/check_mobile", 
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
  	    		  message: resMsg,
  	    		  position: 'middle',
  	    		  duration: 1000
  	    	     });
  	    	     
  	    	     __this.button_disabled=false;
                 return false;
			   
			   }
			   
            },
            
            error: function (jqXHR, textStatus, errorThrown) 
		    {
               
			     alert("貌似出了点问题，请稍后再试"); 
			     
			      __this.button_disabled=false;
            }
            
            
              
         });
            
       },
       
       //提交认证
       authen () {
        Indicator.open({
           text: '认证中,请稍后...',
           spinnerType: 'fading-circle'
        });
        this.authen_button_disabled=false;
        var json={"mobile":this.mobile,"code":this.code,"member_authen_id":this.member_authen.id};
		var jsondata=JSON.stringify(json);
		var __this=this;
         $.ajax({
           type:"POST",
           contentType: "application/json; charset=utf-8",
           url:__this.domain+"/newsales/register_mobile", 
           data:jsondata,
           datatype: "json",
           success: function (message) 
		   {
			   var resMsg=message.resMsg;
			   var resCode=message.resCode;
			   Toast({
  	    		     message: resMsg,
  	    		     position: 'middle',
  	    		     duration: 1000
  	    	    });
			   
			   if(resCode=='0') 
			   {
			       __this.wechat_authen_show=false; 
			       __this.mobile_binded=true;
			       __this.member={};
			       __this.member.id=message.id;
			       __this.member.mobile=message.mobile;
			       __this.member.regtime=message.regtime;
			       
			       //向cart.vue发事件，更新 member
                   __this.$bus.emit('memberChange',__this.member);
			       Indicator.close();
			       //切换至cart.vue 
			       __this.$bus.emit('showTab','购物车');
			       
			        
			       
			       
			        
			   }else 
			   {
				    
  	    	         __this.authen_button_disabled=false;
  	    	          Indicator.close();
                     return false;
			   
			    }
			   
              
            },
            
            error: function (message) 
		    {
               
			    alert("貌似出了点问题，请稍后再试"); 
			    __this.authen_button_disabled=false;
			     Indicator.close();
            }
              
         });
         
         
  
       },
       
       showAddressAdd () {
         this.wechat_authen_show=false;
         this.show_address_add=true;
         this.show_address_list=false;
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
           url:__this.domain+"/business/send_sms_simple", 
           data:jsondata,
           withCredentials:true,
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
  	    		     message: resMsg,
  	    		     position: 'middle',
  	    		     duration: 500
  	    	         });
  	    	         __this.button_disabled=false;
                     return false;
			   
			    }
			   
              
            },
            
            error: function (message) 
		    {
               
			    alert("貌似出了点问题，请稍后再试"); 
			    __this.button_disabled=false;
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
                    this.mobile_binded=false;
                   
             });
             
              // 监听来自FootBar.vue中用户登录的信息，由$emit发出 
             this.$bus.on('memberChange', (val) => {
               
                 this.member=val;
                 localStorage.setItem("global.member",JSON.stringify(val));
                 
             });
             
             this.$bus.on('memberAuthenChange', (val) => {
               
                this.member_authen=val;
                localStorage.setItem("global.member_authen",JSON.stringify(val));
                 
                
             });
             
             this.$bus.on('switchMyTab', (val) => {
               
                this.selected=val;
                this.fetch_orders();
                
             });
             
            this.fetch_orders();
       
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
