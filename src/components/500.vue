<template>
  <div style="height:100%">
      <div class="login-content">
        <div class="login-mian">
          <div class="img500 fl"><img class="" src="@/assets/img/500.png" /></div>
          <div class="text500 fr">
            <span>
              <div class="ero500">500</div>
              <p>抱歉，服务器出错了</p>
              <el-button type="primary" size="medium"> <router-link to="/" style="color:#fff">返回首页</router-link></el-button>
            </span>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
    }
  }
}
</script>
<style scoped>
.login-content{display: flex; min-height: 100%; flex-direction: column;}
.login-mian{ padding:100px 0; width: 900px;margin:0 auto; flex: 1 1 0%; font-size: 0}
.img500,.text500{ height: 400px;}
.img500 img{ display: block; height: 100%; max-width: 700px;}
.text500{display: flex; flex-flow: wrap; align-items: center;}
.text500 p{ line-height: 22px; font-size: 20px; color: #999; margin:20px 0;}
.ero500{ line-height: 90px; font-size: 90px; color: #636363; }
</style>
