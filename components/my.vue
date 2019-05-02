<template>
  <div class="page-navbar">
    
    <mt-navbar class="page-part" v-model="selected">
    
      <mt-tab-item id="会员资料">
        <div class="option">会员资料</div>
      </mt-tab-item>
      <mt-tab-item id="帐户">
        <div class="option">帐户</div>
      </mt-tab-item>
      <mt-tab-item id="地址簿">
        <div class="option">地址簿</div>
      </mt-tab-item>
    <mt-tab-item id="订单">
        <div class="option">订单</div>
      </mt-tab-item>
      
      
    </mt-navbar>

    <div>
      <mt-cell class="page-part" title="当前选中">{{ selected }}</mt-cell>
    </div>

    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="会员资料">
        会员资料
      </mt-tab-container-item>
      <mt-tab-container-item id="帐户">
       帐户
      </mt-tab-container-item>
      <mt-tab-container-item id="地址簿">
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
      </mt-tab-container-item>
      <mt-tab-container-item id="订单">
        订单
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
export default {
  name: 'My',

  data() {
    return {
      selected: '1'
    };
  }
};
</script>

<style scoped>

 .option{
 
   font-weight:bold;font-size:1.2em;
   width:120px;
   
 
 }
 
 .option a:active{
 
     border-bottom:2px solid blue;
 }

</style>
