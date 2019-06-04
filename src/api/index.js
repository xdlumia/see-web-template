import axios from 'axios'
import { apiConfig } from 'see-web-basic'
import exampleService from './exampleService.js' // 演示
import systemService from './systemService.js' // 系统设置
import companyInitService from './companyInitService.js' // 公司初始化
import resourceService from './resourceService.js' // 资源管理  #9013
import seeExternService from './seeExternService.js' // 维护管理
import bizSystemService from './bizSystemService'
import seeHouseConfigService from './seeHouseConfigService'
import seeBaseHouseService from './seeBaseHouseService'
import seeBaseinfoService from './seeBaseinfoService' // 公司设置

axios.defaults.timeout = 200000

apiConfig.registry({
  exampleService,
  systemService,
  companyInitService,
  resourceService,
  seeExternService,
  bizSystemService,
  seeHouseConfigService,
  seeBaseHouseService
})
// 新的api使用方法
apiConfig.registryConfig({
  seeBaseinfoService
})
