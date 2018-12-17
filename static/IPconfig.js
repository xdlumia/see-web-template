var aipUrl = '/apis/'

var baseURL = {
  login: aipUrl + 'system-service', // 登录
  seeDataDictionaryService: aipUrl + 'see-data-dictionary-service', // 字典服务
  bizSystemService: aipUrl + 'biz-system-service', // 角色 ，员工，部门
  seeDemoService: aipUrl + 'see-demo-service' // demo
}

window.g = {
  ApiUrl: baseURL
}
