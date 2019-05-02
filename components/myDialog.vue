<template>
    <div class="dialog" v-show="showMask">
        <div class="dialog-container">
            <div class="dialog-title">商品挑选 </div>
            
            <div class="content">
            
            <!-- starrt content -->
            
            <div class="image-container">
  
   <img src="../images/wenbixia.jpg" width="150" height="150">
  
  </div>
  
  <p>颜色</p>
  
  <ul>
  <li v-for="(item,index) in colors" class="label" 
   :class="{label_active: selected == index}"  @click="chooseItem(index)">
      {{ item }} 
  </li>
  </ul>
  <div class="clear"></div>
  
  <p>尺寸</p>
 
  <ul>
  <li v-for="(item,index) in sizes" class="label" 
   :class="{label_active: selected2 == index}"  @click="chooseItem2(index)">
      {{ item }} 
  </li>
  </ul>
  
  <div class="clear"></div>
  
  
  
  <!--
  <mt-button type="primary" size="normal" @click="sayHello">SayHello</mt-button>
  -->    
            
    <!-- end of content -->
            
            
            
            
            </div>
            
            
            
            
            <div class="btns">
                <div  class="default-btn" @click="closeBtn">
                    不买了
                </div>
                
                <div  class="confirm-btn" @click="confirmBtn">
                    加入购物车
                </div>
            </div>
            <div class="close-btn" @click="closeMask"><img src="../images/close.png"></div>
          
        
        </div>
        
    </div>
</template>
<script>


export default {
  name:'MyDialog',
     
    props: {
        
       
    },
    data(){
        return{
            showMask: false,
            colors:["red","yellow","black"],
            selected:-1,
            sizes:["36","37","38"],
            selected2:-1 
        }
    },
    methods:{
        closeMask(){
            this.showMask = false;
        },
        closeBtn(){
            //this.$emit('cancel');
            this.closeMask();
        },
        dangerBtn(){
            //this.$emit('danger');
            this.closeMask();
        },
        confirmBtn(){
            //this.$emit('confirm');
            this.closeMask();
        },
        chooseItem(index){
        
         this.selected=index;
      },
      chooseItem2(index){
         
         this.selected2=index;
      },
      sayHello(){
      
       alert("sayHello");
      
      }
    },
    mounted(){
       
    },
     created(){
     //resetDialogShow is event from product.vue $emit 
     this.$bus.on('resetDialogShow', (val) => {
          //alert('---Hello---');
          this.showMask=true;
         
         
     });
  
  },
    
    
    watch:{
       showMask(newVal, oldVal){
            
        }
    }
}
</script>
<style lang="less" scoped>
    .dialog{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9999;
        .dialog-container{
            width:  350px;
            height: 100%;
            background: #FFFFE0;
            position: absolute;
            top: 50%;
            left: 50%;
            overflow:auto;
            transform: translate(-50%, -50%);
            border-radius: 8px;
            position: relative;
            .dialog-title{
                width: 100%;
                height: 60px;
                font-size: 18px;
                color: #696969;
                font-weight: 600;
                padding: 16px 50px 0 20px;
                box-sizing: border-box;
            }
            .content{
                color: #797979;
                width:100%;
                overflow:auto;
                padding: 0 5px;
                box-sizing: border-box;
            }
            .inp{
                margin: 10px 0 0 20px;
                width: 200px;
                height: 40px;
                padding-left: 4px;
                border-radius: 4px;
                border: none;
                background: #efefef;
                outline: none;
                &:focus{
                    border: 1px solid #509EE3;
                }
            }
            .btns{
                width: 100%;
                height: 60px;
                position: relative;
                bottom: 0;
                left: 0;
                text-align: right;
                padding: 0 16px;
                box-sizing: border-box;
                & > div{
                    display: inline-block;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 14px;
                    color: #ffffff;
                    background: #f1f1f1;
                    border-radius: 8px;
                    margin-right: 12px;
                    cursor: pointer;
                }
                .default-btn{
                    color: #787878;
                    &:hover{
                        color: #509EE3; 
                        border:1px solid red;
                    }
                }
                .danger-btn{
                    background: #EF8C8C;
                    &:hover{
                        background: rgb(224, 135, 135);
                    }
                    &:active{
                        background: #EF8C8C;
                    }
                }
                .confirm-btn{
                    color: #ffffff;
                    background: #509EE3;
                    &:hover{
                        background: #6FB0EB;
                    }
                }
            }
            .close-btn{
                position: absolute;
                top: 16px;
                right: 16px;
                width: 30px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                font-size: 18px;
                cursor: pointer;
                &:hover{
                    font-weight: 600;
                }
            }
        }
    }
    
    
    
    p
{
 color:#000

}
ul{
  padding:5px 5px;
}
li {
  
   width:90px;
   height:25px;
   padding:2px 2px;
   text-align:center;
   float:left;
   list-style:none;
   margin:3px 2px;

}

 .label{
    
    border-radius:8px;
    color:#000;
    background:#fff;
 }
 
 .label_active{
     color:red;
     border-radius:8px;
     border:1px solid red;
     background:#fff;
 }

.clear{

   width:100%;
   height:1px;
   background:#fff;
   display:block;
   clear:both;
}

.image-container{

   width:100%;
   
   margin:3px;
   
   background:#fff;
   
   text-align:left;
}
    
</style>
