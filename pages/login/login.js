//index.js
//获取应用实例 
const app = getApp()
const OPEN_ID = wx.getStorageSync('OPEN_ID') //储存获取到openid   
const SESSION_KEY = '' //储存获取到session_key
import Toast from '../../libs/vant/toast/toast';
import Notify from '../../libs/vant/notify/notify';
Page({
  data: {
    testPhoneCode: '',
    name: '',
    idNumber: '',
    phoneNumber: '',
    phoneCode: '',
    isAgree: 1
  },
  //事件处理函数
  onLoad: function(options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  phoneNumberChange(e) {
    this.data.phoneNumber = e.detail.value;
  },
  nameChange(e) {
    this.data.name = e.detail.value;
  },
  idNumberChange(e) {
    this.data.idNumber = e.detail.value;
  },
  phoneCodeChange(e) {
    this.data.phoneCode = e.detail.value;
  },
  //获取手机验证码
  getPhoneCode() {
    if (this.data.phoneNumber === ''){
      Notify({
        type: 'danger',
        message: `请输入手机号`
      });
      return
    }
    /**
     * 自动填充测试验证码，后台不校验
     */
    this.setData({
      phoneCode: '0000'
    })
    return
    /**
     * 生产环境将以上删除
     */
    if (this.data.phoneNumber == '') {
      Notify({
        type: 'danger',
        message: '请输入手机号'
      });
      return
    }
    let req = {
      "action": {
        "serviceCode": "SC000003"
      },
      "body": {
        "phoneNO": `${this.data.phoneNumber}`,
        "busInfo": "0"
      }
    }
    const apiUrl = getApp().globalData.host + escape(JSON.stringify(req));
    const that = this
    wx.request({
      //获取openid接口  
      url: apiUrl,
      data: {},
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      method: 'POST',
      success: function(res1) {
        console.log('phonecode===', res1.data)
        if (res1.data.action.result != '0000') {
          Notify({
            type: 'danger',
            message: res1.data.action.message
          });
          return
        }
        Notify({
          type: 'success',
          message: `验证码获取成功`
        });
      }
    })
  },
  //用户绑定
  bindUser() {
    if (this.data.name == '') {
      Notify({
        type: 'danger',
        message: '请输入姓名'
      });
      return
    } else if (this.data.idNumber == '') {
      Notify({
        type: 'danger',
        message: '请输入身份证号'
      });
      return
    } else if (this.data.phoneNumber == '') {
      Notify({
        type: 'danger',
        message: '请输入手机号'
      });
      return
    }
    /**
     * 生产环境将校验验证码解开注释
     * */ 
    else if (this.data.phoneCode == '') {
      Notify({ type: 'danger', message: '请输入验证码' });
      return
    }
    let req = {
      "action": {
        "serviceCode": "SC000004",
      },
      "body": {
        "openID": OPEN_ID,
        "phoneNO": `${this.data.phoneNumber}`,
        "ownerNam": `${this.data.name}`,
        "certNO": `${this.data.idNumber}`,
        "actFlag": "0",
        "msgCode": `${this.data.phoneCode}`,
        "busInfo": "0"
      }
    }
    // return
    console.log('绑定req===', req)
    const that = this
    const apiUrl = getApp().globalData.host + encodeURI(JSON.stringify(req));
    // return
    wx.request({
      //获取openid接口  
      url: apiUrl,
      data: {},
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      method: 'POST',
      success: function(res) {
        if (res.data.action.result != '0000') {
          //错误提示
          Notify({
            type: 'danger',
            message: res.data.action.message
          });
          return
        }
        wx.redirectTo({
          url: '/pages/home/home',
        })
      },
      fail() {
        console.log('error!!!')
      }
    })
  }
})