<template>
  <div style="height:100%">
      <div class="login-content">
        <app2></app2>
        <div class="login-mian">
          <div class="img403 fl"><img class="" src="@/assets/img/403.png" /></div>
          <div class="text403 fr">
            <span>
              <div class="ero403">403</div>
              <p>抱歉，你无权访问该页面</p>
              <el-button type="primary" size="medium"> <router-link to="/" style="color:#fff">返回首页</router-link></el-button>
            </span>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
</script>
<style scoped>
.login-content{display: flex; min-height: 100%; flex-direction: column;}
.login-mian{ padding:100px 0; width: 900px;margin:0 auto; flex: 1 1 0%; font-size: 0}
.img403,.text403{ height: 400px;}
.img403 img{ display: block; height: 100%; }
.text403{display: flex; flex-flow: wrap; align-items: center;}
.text403 p{ line-height: 22px; font-size: 20px; color: #999; margin:20px 0;}
.ero403{ line-height: 90px; font-size: 90px; color: #636363; }
.d-login-footer p a{padding: 0 5px; color: rgba(0,0,0,.5); }
</style>
