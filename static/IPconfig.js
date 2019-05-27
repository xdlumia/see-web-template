var aipUrl = '/apis/'

var baseURL = {
  systemService: aipUrl + 'system-service', // 登录
  resourceService: aipUrl + 'resource-service', // 9013
  bizSystemService: aipUrl + 'biz-system-service', // 角色 ，员工，部门
  seeDataDictionaryService: aipUrl + 'see-data-dictionary-service', // 字典服务

}

window.g = {
  ApiUrl: baseURL
}
