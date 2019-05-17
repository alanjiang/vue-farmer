<template>
    <div>
<mt-field label="收件人" placeholder="请输入收件人姓名" v-model="username"></mt-field>
<mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
<mt-field label="网站" placeholder="请输入网址" type="url" v-model="website"></mt-field>
<mt-field label="数字" placeholder="请输入数字" type="number" v-model="number"></mt-field>
<mt-field label="生日" placeholder="请输入生日" type="date" v-model="birthday"></mt-field>
<mt-field label="自我介绍" placeholder="自我介绍" type="textarea" rows="4" v-modal="introduction"></mt-field>
    </div>
</template>
<script>
    import { Field } from 'mint-ui';
    export default {
    
      name: 'Address',
      
      data () {
            return {
               
                 index:-1
            }
        },
        computed: {
            
        },
       
        methods: {
               
                
              
            
        },
        
        mounted(){
        
          
        },
        
         created(){
              
       
       }
        
        
        
    }
</script>
<style scoped>
    
</style>