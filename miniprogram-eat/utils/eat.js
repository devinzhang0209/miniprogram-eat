let backend_url = 'https://ele.vbhledger.com';

/**
 * 查询部门列表，数据格式如下
 * [{"deptId":33,"deptName":"开发部"}]
 */
function getDept(){
  return new Promise((resolve,reject) => {
    wx.request({
      url: backend_url+'/eat/getDeptList',
      data: {
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        resolve(res.data)
      }
    })
  })
}

/**
 * 查询部门下的员工，返回格式如下,
 * [{"empId":1,"empName":"devin","deptId":33},{"empId":2,"empName":"zbb","deptId":33}]
 */
function getEmp(deptId){
  return new Promise((resolve,reject) => {
    wx.request({
      url: backend_url+'/eat/getEmpList?deptId='+deptId,
      data: {
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        resolve(res.data)
      }
    })
  })
}

/**
 * 保存数据
 */
function save(dept,deptName,emp,empName,today,eatType,eatIf,eatMealType){

  return new Promise((resolve,reject) => {
    wx.request({
      url: backend_url+'/eat/save',
      data: {
        deptId: dept,
        deptName: deptName,
        empId: emp,
        empName: empName,
        eatDate: today,
        eatType: eatType,
        eatIf: eatIf,
        eatMealType : eatMealType
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        resolve(res.data);
      }
    })
  })
}
/**
 * 获取当前时间
 */
function getDate(){
  var date = new Date(); 
var mon = date.getMonth() + 1;
var day = date.getDate();
var nowDay = date.getFullYear() + "-" + (mon<10?"0"+mon:mon) + "-" +(day<10?"0"+day:day);
return nowDay;
}

/**
 * 获取日期
 * getDateStr(0) 今天
 * getDateStr(-1) 昨天
 * getDateStr(1) 明天
 */
function getDateStr(addDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate()+addDayCount);//获取addDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth()+1;//获取当前月份的日期
  var d = dd.getDate();
  var mStr = m>=10?m:'0'+m;
  return y+"-"+mStr+"-"+d;
  }

module.exports = {
  getDate:getDate,
  getDateStr:getDateStr,
  getDept: getDept,
  getEmp:getEmp,
  save:save,
}