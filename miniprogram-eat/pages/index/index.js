// const common = require('../../utils/common');
// const api = require('../../utils/api');
const eat = require("../../utils/eat.js");
const dateTimePicker = require('../../utils/dateTimePicker.js');
const app = getApp();
 
Page({
  data: {
    dateSelectd:'',
    depts:[],
    dept_index: 0,
    deptId:0,
    emps:[],
    emp_index:0,
    lunchOrDiner: [{id:1,name:'午餐',checked:true},{id:2,name:'晚餐'}],
    lunchOrDinerValue:'午餐',
    mealType:[{id:1,name:'荤素',checked:true},{id:2,name:'纯素'}],
    mealTypeValue :"荤素",
    eatOrNot:'是',
    userID: 0
  },
  onLoad: function (){
    let self = this;
    this.setData({ userID: app.globalData.userID });
    let dateDefault = eat.getDate();
    this.setData({ dateSelectd: dateDefault });
    this.getDept() //获取部门信息
  },
  changeDate:function(e){
    let dateSelectd = e.detail.value;
    this.setData({ dateSelectd:dateSelectd });
  },
  getDept: function() {
    eat.getDept().then(res => {
     this.setData({ depts:res });
     if(res && res.length > 0){
      eat.getEmp(res[0].deptId).then(res =>{
        this.setEmp(res);
       });
     }
    })
  },
  bindPickerChange_hx: function (e) {
    console.log('picker发送选择改变，下标为', e.detail.value);
    this.setData({   //给变量赋值
      dept_index: e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
   });
     let deptId = this.data.depts[e.detail.value].deptId;
     console.log("deptId:"+deptId);
     eat.getEmp(deptId).then(res =>{
      this.setEmp(res);
     });
     
   },
   setEmp:function(emps){
    this.setData({ emps:emps });
   },
   bindEmp: function (e) {
    console.log('picker发送选择改变，下标为', e.detail.value);
    this.setData({   //给变量赋值
      emp_index: e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
   });
   },
   lunchOrDinerBind:function(e) {
     let lunchOrDinerValue = e.detail.value;
     console.log("lunchOrDinerValue:"+lunchOrDinerValue);
     this.setData({ lunchOrDinerValue: lunchOrDinerValue });
     },
   mealTypeBind:function (e) {
    this.setData({   
      mealTypeValue: e.detail.value,  
   });
   },
   eatOrNotBind:function(event){
    let checkedValue = event.detail.value;
    console.log("checkedValue:"+checkedValue);
    let eatOrNot;
    if(checkedValue){
      eatOrNot ="是";
    }else{
      eatOrNot ="否";
    }
    this.setData({   
      eatOrNot:eatOrNot,  
   });
   },
  saveNewAddress: function () {
    let self = this;
       let dateStr = self.data.dateSelectd
       let deptId = self.data.depts[self.data.dept_index].deptId;
       let deptName = self.data.depts[self.data.dept_index].deptName;
       let empId = self.data.emps[self.data.emp_index].empId;
       let empName = self.data.emps[self.data.emp_index].empName;
       let lunchOrDinerValue = self.data.lunchOrDinerValue;
       let mealTypeValue = self.data.mealTypeValue;
       let eatOrNot = self.data.eatOrNot;

       let today = eat.getDateStr(0);
       let tommorrow = eat.getDateStr(1);
       if(dateStr !=today && dateStr != tommorrow){
        this.alertError('只能定今天和明天的餐哦');
        return;
       }
       if(dateStr == today){
        let date=new Date();
        let hour = date.getHours();
        let minute = date.getMinutes();
        if(lunchOrDinerValue == "晚餐"){
          //晚餐时间必须在13:30-17:30
          if(hour<13 || hour>17){
            this.alertError('晚餐订购时间为13:30-17:30');
            return;
          }
          if(hour == 13 && minute < 30 ){
            this.alertError('晚餐订购时间为13:30-17:30');
            return;
          }
          if(hour == 17 && minute>30){
            this.alertError('晚餐订购时间为13:30-17:30');
            return;
          }
        }else{
          //午餐订购时间为09:00-11:30
          if(hour <9 || hour > 11){
            this.alertError('午餐订购时间为09:00-11:30');
            return;
          }
          if(hour == 11 && minute >30){
            this.alertError('午餐订购时间为09:00-11:30');
            return;
          }
        }
       };
       wx.showModal({
         title: '提示',
         content: '确定订餐么',
         success: function(res) {
            if (res.confirm) {
              //save(dept,deptName,emp,empName,today,eatType,eatIf,eatMealType)
              wx.showLoading({
                title: '订餐中...',
                });
              eat.save(deptId,deptName,empId,empName,dateStr,lunchOrDinerValue,eatOrNot,mealTypeValue).then(res =>{
                wx.hideLoading();
                console.log("result:"+res);

                if(res == 0){
                  self.alertError('已经定过了哦');
                    return;
                }else{
                  self.alertError('订餐成功');
                    return;
                }
                });
              } 
              else if (res.cancel) {
                this.alertError('用户撤销订餐');
              }
        }
      });
  },

  alertSucess:function(msg){
    wx.showToast({
      title: msg+'',
      icon: 'success',
      duration: 2000
     })
  },
  alertError:function(msg){
    wx.showToast({
      title: msg+'',
      icon: 'none',
      duration: 2000
     })
  }
});