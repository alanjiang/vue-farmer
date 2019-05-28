<template>

<div>

<mt-button type="primary" size="small" @click="visible = true">remove</mt-button>

<hsy-dialog class="confirm" v-model="visible" style="width:350px">
  <div slot="title" style="width:350px">登录验证</div>
  <div slot="body" style="width:350px">
    <div>
        <mt-field label="手机号" placeholder="手机号" v-model="mobile"></mt-field>
          <mt-field label="验证码" placeholder="验证码" type="code" v-model="code">
           <mt-button type="primary" size="small">免费获取</mt-button>
       </mt-field>
       
       <p style="text-align:center;">  
            <mt-button type="primary" size="small"  @click="authen">立即去认证</mt-button>
       </p>
         
    </div>
    <div>
     <p> 第三方认证 </p>
     
     <p> 
     
     <a href="#"><img src="../images/wechat_authen.png"></a> 
     <a href="#"><img src="../images/alipay.gif"></a> 
     </p>
     
    
     <!--
     <p style="text-align:right">
      <mt-button type="primary" size="small" @click="handleYes">取消</mt-button>
      &nbsp; &nbsp;
      <mt-button type="primary" size="small" @click="handleYes">确定</mt-button>
     </p> 
     -->
    </div>
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

import {Button,Field} from 'mint-ui';
export default {
  data() {
    return {
      visible: false
    }
  },
  methods: {
    handleYes() {
      alert('Yes')
      this.visible = false
    }
  }
}
</script>