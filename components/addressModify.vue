<template>

<div>

<hsy-dialog class="confirm" v-model="show_address_edit" style="width:350px">
  <div slot="title" style="width:330px">地址修改</div>
  <div slot="body" style="width:330px">
     <mt-field label="收件人" placeholder="请输入收件人姓名" type="username" v-model="rec_name"></mt-field>
          <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="rec_mobile"></mt-field>

          <mt-cell title="收件地址"></mt-cell>
          <v-distpicker :province="cur_obj.province" :city="cur_obj.city" :area="cur_obj.district" @selected="areaChecked"></v-distpicker>

         <mt-field label="详细街道信息" placeholder="详细街道信息" type="textarea"  v-model="rec_detail" ></mt-field>
         
         <mt-button type="primary" size="large"  @click="address_edit_save">保存</mt-button>
          
    </div>
 
</hsy-dialog>
</div>
</template>

<style scoped>
.hsy-dialog .main .title .content>* {
  width: 95%;
  min-width: 85px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
<script>

import {Button,Field,Toast, Indicator} from 'mint-ui';
import $ from 'jquery';
import constants from '../utils/constants.js';

export default {
  data() {
    return {
       show_address_edit: false,
       cur_obj:{province:'',city:'', district:null },
       rec_id:null,
       rec_name:null,
       rec_mobile:null,
       rec_province:null,
       rec_city:null,
       rec_district:null,
       rec_detail:null,
       domain: constants.domain
    }
  },
  
  methods: {
  
    areaChecked (data) {
     
      this.rec_province=data.province.value;
      this.rec_city=data.city.value;
      this.rec_district=data.area.value;
   },
   
   address_edit_save () {
   
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
    		   "mobile":this.rec_mobile,"province":this.rec_province,"city": this.rec_city,"district":this.rec_district,"detail":this.rec_detail
    		   }
     
       var __this=this;
       var jsondata=JSON.stringify(json);

       Indicator.open({
           text: '请求提交中...',
           spinnerType: 'fading-circle'
       });
           $.ajax({
           type:"POST",
           contentType: "application/json; charset=utf-8",
           url:__this.domain+"/address/update",
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
			   
			     
				  __this.show_address_edit=false;
				  //地址修改成功后，通知my.vue组件更新修改的地址
				  //alert(message.address);
				  __this.$bus.emit('addressUpdate',message.address);
				   
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
   
   }
   
  
  },
  created(){
              // 监听来自my.vue修改地址事件，由$emit发出 
             this.$bus.on('address_change', (val) => {
               
               this.show_address_edit=true;
               //alert(JSON.stringify(val));
               this.cur_obj=val;
               this.rec_name=val.name;
               this.rec_mobile=val.mobile;
               this.rec_province=val.province;
               this.rec_city=val.city;
               this.rec_district=val.district;
               this.rec_detail=val.detail;
               this.rec_id=val.id;
             });
          
             
       }
}
</script>