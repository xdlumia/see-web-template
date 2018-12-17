<template>
  <div style="height: 100%" v-loading="loading">
    <el-container class="d-container">
      <!-- 头部区域 -->
      <el-header height="60px" class="header-top">
        <!-- 右边公司名称 -->
        <div class="d-header-left">
          <img class="header-img mr10" src="@/assets/img/alogo.svg"/>
          <div>
            <p> β写字楼办公管理系统 </p>
            <p> 帮助房地产中介提升企业产能 </p>
          </div>
        </div>
        <!-- 菜单 -->
        <el-menu :default-active="activeIndex" class="d-header-main" mode="horizontal"
                 :router="true"
                 :unique-opened="true">
          <el-menu-item
            v-for="(item,index) of navData" :key="index"
            :index="item.url"
            v-if="!item.children">{{item.name}}
          </el-menu-item>

          <el-submenu v-else :index="index + ''">
            <template slot="title">{{item.name}}</template>
            <el-menu-item v-for="(item1,index1) of item.children" :key="index1" :index="item1.url">{{item1.name}}
            </el-menu-item>
          </el-submenu>

          <!-- 更多应用 -->
          <el-dropdown class="d-pointer ml10" style="color:#909399;margin-top: 20px">
              <span class="el-dropdown-link">
                更多应用<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <a v-if="syslistCodeArr.includes('decorate')" :href="decorateUrl+'?token='+token+'&finger='+finger"
                   class="fl">
                  <div style="width:50px;height:50px;background:#3aaefa;color:#FFF" class="lh50 f24 ac"><i
                    class="el-icon-menu"></i></div>
                  <span style="width:80px;height:50px;color:#909399">装修平台</span>
                </a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu>
        <!-- 左边用户信息 -->
        <div class="d-header-right">
          <el-menu class="user fl" mode="horizontal" :router="true">
            <el-submenu index="">
              <template slot="title">
                <div>
                  <img src="@/assets/img/adminimg.png"/>
                  <div>
                    <p> {{userInfo.roleName}} </p>
                    <p> {{userInfo.userName}} </p>
                  </div>
                </div>
              </template>
              <el-menu-item index="/login" @click="logout" class="f12">退出</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-header>

      <!-- 中间内容区域 -->
      <el-main class="scroll-wrap">
        <transition mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      loading: false,
      authorityBtn: {},
      activeIndex: '/',
      isCityChange: false, // 城市是否显示
      cityList: [], // 城市列表
      activeName: 'ABC',
      cityInfo: '',
      syslist: [],
      syslistCodeArr: [],
      searchCityName: '', // 搜索城市名字
      userInfo: this.$local.fetch('userInfo'),
      navData: [], // 所有权限码
      buttonsCode: [], // 当前页面最大的菜单的权限码
      sysemployeeCode: [], // 系统设置下拉框权限码
      assistCode: [], // 辅助管理下拉框权限码
      asystemUrl: window.baseURL.asystemUrl, // 租住平台的地址
      decorateUrl: window.baseURL.decorateUrl // 装修平台的地址
    }
  },
  components: {},
  created () {
    // 判断当前是否从别的平台跳转到当前
    let urlParams = this.$route.query || {}
    let token = urlParams.token
    let finger = urlParams.finger

    if (urlParams.token) {
      localStorage.setItem('token', token)
      localStorage.setItem('finger', finger)
      this.loading = true

      this.getNavData().then(() => {
        // 获取公共的信息
        this.navData = JSON.parse(localStorage.getItem('navData')) || []
        this.syslist = JSON.parse(localStorage.getItem('syslist')) || []
        this.syslist.forEach(item => {
          this.syslistCodeArr.push(item.syscode)
        })

        this.$router.replace({
          path: this.navData[0] ? this.navData[0].url : '/'
        })
      }).finally(() => {
        this.loading = false
      })
    } else {
      // 获取公共的信息
      this.navData = JSON.parse(localStorage.getItem('navData')) || []
      this.syslist = JSON.parse(localStorage.getItem('syslist')) || []
    }
  },
  watch: {
    '$route' () {
      let title = this.$route.meta.title
      document.title = title
    }
  },
  methods: {
    handleSelect () {
    },
    // 退出登录
    logout () {
      localStorage.token = ''
      localStorage.timer = ''
      this.$router.push({path: '/login'})
    },
    // 获取菜单权限
    getNavData () {
      return Promise.all([this.$api.bizSystemService.getUserAuth('asystem')
        .then(res => {
          const loginData = res.data || [{url: '/'}]
          // 存储菜单
          localStorage.setItem('navData', JSON.stringify(loginData))
          this.authorityBtn = {} // 按钮权限
          this.authorityHandle(loginData)
          // 存储功能权限
          localStorage.setItem('authorityBtn', JSON.stringify(this.authorityBtn))
          this.$local.save('authorityBtn', this.authorityBtn)
        }),
        // 获取当前用户可操作的系统/平台列表
      this.getsyslist(),
        // 根据token查询用户信息
      this.$api.bizSystemService.getUserDetail().then(res => {
        let data = res.data
        let rmDeptEntity = data.rmDeptEntity || {} // 部门
        let rmRoleEntities = data.rmRoleEntities || [] // 人员

        this.$local.save('userInfo', {
          userName: data.name,
          userId: data.id,
          deptId: data.deptId, // 部门id
          companyCode: data.companyCode, // 公司code
          account: data.account, // 帐号
          companyName: data.companyEntity.companyName, // 公司名字
          roleType: rmRoleEntities[0] && rmRoleEntities[0].id, // 人员权限
          deptName: rmDeptEntity.deptName, // 部门名字
          roleName: rmRoleEntities[0] && rmRoleEntities[0].roleName // 角色名字
        })
      })])
    },
    // 获取当前用户可操作的系统/平台列表
    getsyslist () {
      return this.$api.bizSystemService.getsyslist()
        .then(res => {
          localStorage.setItem('syslist', JSON.stringify(res.data || []))// 存储该用户拥有的平台权限
        })
    },
    // 递归处理权限数据
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
    },
    fsearchCityName () {
      let params = {
        cityName: this.searchCityName
      }
      this.$api.seeHouseConfigService.getCityList(params) // 获取城市列表
        .then(res => {
          this.cityList = res.data || []
        })
    }
  }
}
</script>
<style scoped lang="scss">
  .cityChange {
    margin-top: 13px !important;
    height: 33px;
    width: auto !important;
    max-width: 2000px;
    min-width: 60px;
    min-height: 35px;
    background: #F2F2F2;
    margin-top: 15px;
    border-radius: 20px;
    line-height: 35px !important;
    position: relative !important;
    .cityChangeDrop {
      display: flex;
      box-sizing: border-box;
      position: absolute;
      width: 487px;
      height: 434px;
      border: 1px solid #F2F2F2;
      left: -145px;
      top: 50px;
      z-index: 50;
      .cityChangeTop {
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #F2F2F2;
      }
      .cityChangeTab {
        border: 1px solid #F2F2F2;
        width: 460px;
        height: 322px;
        .el-tabs__item {
          padding: 0px 13px !important;
        }
      }
    }
  }

  .header-top {
    width: 100%;
    background: #ffffff;
    position: relative;
  }

  .d-header-left {
    float: left;
    min-width: 280px;
    max-width: 400px;
    font-size: 12px;
    margin-top: 10px;
    img {
      float: left;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    div {
      width: 182px;
      font-size: 12px;
      float: left;
      line-height: 20px;
      color: #999;
      p:nth-child(1) {
        color: #111;
      }
    }

  }

  .d-header-main {
    margin-left: 300px;
  }

  .el-menu.el-menu--horizontal {
    border-bottom: none
  }

  .d-header-right {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 12px;
    img {
      display: inline-block;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    div {
      margin-left: 11px;
      display: inline-block;
      line-height: 20px;
      font-size: 12px;
      color: #ccc;
      p:nth-child(1) {
        color: #111;
      }
    }
  }

  .scroll-wrap {
    padding: 10px;
  }
</style>
<style lang="scss">
  .scroll-wrap {
    .main-content {
      height: calc(100vh - 80px);
    }
  }
</style>
