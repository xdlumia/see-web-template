<template>
  <div style="height:100%; over">
    <canvas ref="myCanvas" id="myCanvas"></canvas>
    <div class="login-content">
      <div class="login-mian">
        <div class="login-header">
          <img class="logo" src="@/assets/img/alogo.svg" alt="">
          <h2>β写字楼办公管理系统</h2>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-info">
          <el-form-item prop="account">
            <el-input type="text" v-model="loginForm.account" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input type="password" v-model="loginForm.pwd" placeholder="请输入密码" v-on:keyup.13.native="loginBtn()"></el-input>
          </el-form-item>
          <div style="margin-bottom:10px; height:25px;">
            <el-checkbox-group v-model="remember">
              <el-checkbox label="记住密码" name="type"></el-checkbox>
            </el-checkbox-group>
          </div>
          <el-form-item>
            <el-button style="width: 100%" type="primary" :loading="loading" @click="loginBtn()">{{loadingText}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="login-footer ">
        <p>copyright © 2018
          <a href="/" target="_blank">fanteren</a>
        </p>
        <p>
          <span>
            <a href="/" target="_blank">帮助</a>
          </span>
          <span>
            <a href="/" target="_blank">隐私</a>
          </span>
          <span>
            <a href="/" target="_blank">条款</a>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Fingerprint2 from 'fingerprintjs2'

let baseURL = window.g.ApiUrl

export default {
  name: 'login',
  data () {
    return {
      authorityBtn: {},
      loading: false,
      loadingText: '立即登录',
      remember: true, // 是否记住密码
      routeUrl: '',
      loginForm: {
        account: '',
        pwd: '',
        syscode: 'asystem',
        finger: '',
        from: 1
      },
      rules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 读取用户信息
    let userInfo = this.$local.fetch('userInfo')
    // 记住密码
    let account = userInfo.account
    let pwd = userInfo.pwd
    this.loginForm.account = account
    this.loginForm.pwd = pwd
    // 载入页面获取当前页面名称
    document.title = this.$route.meta.title
  },
  mounted () {},
  methods: {
    // 登录
    loginBtn () {
      this.loading = true
      this.loadingText = '登录中'
      // 获取浏览器指纹
      new Fingerprint2({
        excludeSessionStorage: true
      }).get((finger, components) => {
        localStorage.setItem('finger', finger)
        this.loginForm.finger = finger // 获取指纹
        axios.get(baseURL.login + '/login/login', {params: this.loginForm})
          .then(res => {
            // axios 返回值已被修改，重新包装下
            if (res.code === 200) {
              var userId = res.data.id
              var userName = res.data.name
              var deptId = res.data.deptId
              var token = res.data.token
              localStorage.token = token
              axios.defaults.headers.finger = localStorage.finger
              axios.defaults.headers.token = localStorage.token
              // 存储账户和密码
              this.$api.bizSystemService.getUserDetail().then(res => {
                if (res.code === 200) {
                  var rmDeptEntity = res.data.rmDeptEntity || {} // 部门
                  var rmRoleEntities = res.data.rmRoleEntities || [] // 人员
                  var companyCode = res.data.companyCode
                    if (this.remember === true) { //eslint-disable-line
                    // 存储用户信息
                    this.$local.save('userInfo', {
                      userName: userName,
                      userId: userId,
                      deptId: deptId, // 部门id
                      companyCode: companyCode, // 公司code
                      account: this.loginForm.account, // 帐号
                      pwd: this.loginForm.pwd, // 密码
                      companyName: res.data.companyEntity.companyName, // 公司名字
                      roleType: rmRoleEntities[0] && rmRoleEntities[0].id, // 人员权限
                      deptName: rmDeptEntity.deptName, // 部门名字
                      roleName: rmRoleEntities[0] && rmRoleEntities[0].roleName // 角色名字
                    })
                  } else {
                    // 清空用户信息
                    this.$local.save('userInfo', {})
                  }
                }
              })
              this.$api.bizSystemService.getUserAuth('asystem')
                .then(res => {
                  if (res && res.code === 200) {
                    const loginData = res.data || [{url: '/'}]
                    localStorage.setItem('navData', JSON.stringify(loginData)) // 存储导航信息
                    this.authorityBtn = {} // 按钮权限
                    this.authorityHandle(loginData)
                    localStorage.setItem(
                      'authorityBtn',
                      JSON.stringify(this.authorityBtn)
                    )

                    let router = window.router

                    if (router.currentRoute.query.to) {
                      // 如果路由有参数跳转到之前的路由
                      router.replace(router.currentRoute.query.to)
                    } else {
                      router.replace({
                        path: loginData[0] ? loginData[0].url === '' ? loginData[0].children[0].url : loginData[0].url : '/'
                      })
                    }
                  }
                }).finally(() => {
                  this.loading = false
                  this.loadingText = '立即登陆'
                })
              this.$api.bizSystemService.getsyslist() // 获取当前用户可操作的系统/平台列表
                .then(res => {
                  localStorage.setItem('syslist', JSON.stringify(res.data))// 存储该用户拥有的平台权限
                })
            } else {
              this.loading = false
              this.loadingText = '立即登陆'
              if (this.loginForm.accoung === '') {
                res.msg = '请输入用户名'
              }
              this.$message.error({
                message: res.msg,
                showClose: true
              })
            }
          })
          .finally(() => {
            this.loading = false
            this.loadingText = '立即登录'
          })
      })
    },
    authorityHandle (authorityData) {
      authorityData.forEach((item, index) => {
        if (item.code !== '') {
          this.authorityBtn[item.code] = item.buttonsCode
        }
        // 存在children 递归
        if (item.children && item.children[0]) {
          this.authorityHandle(item.children)
        }
      })
    }
  }
}
</script>
<style scoped >
  .login-content {
    display: flex;
    min-height: 100%;
    flex-direction: column;
    background: url("../assets/img/loginbg.jpg") center;
    width: 100%;
    background-size: cover;
  }

  .login-mian {
    padding: 60px 0 0;
    width: 325px;
    margin: 0 auto;
    flex: 1 1 0%;
  }

  .login-header {
    text-align: center;
    margin-bottom: 40px;
  }
  .login-header .logo{
    display: block;
    height: 100px;
    margin:0 auto
  }

  .login-header p {
    font-weight: 300;
    color: #999;
  }
  .login-footer {
    margin: 0 auto 10px;
  }
  .login-footer p a {
    padding: 0 5px;
    color: rgba(0, 0, 0, 0.5);
  }
  canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
