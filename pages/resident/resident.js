


//index.js
//获取应用实例
const app = getApp()
const APP_ID = 'wx3ab15814222c3a24';//输入小程序appid  
const APP_SECRET = 'aba509b77ef831aa67efba549b212714';//输入小程序app_secret  
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  
Page({
  data: {
    motto: 'ccccc',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value.mobile)
    console.log('form发生了submit事件，携带数据为：', app.globalData.userInfo )
    wx.navigateTo({
      url: '../myroom/myroom?mobile=' + e.detail.value.mobile
    })


  },
  getOpenIdTap: function () {
    var that = this;
    wx.login({
      
      success: function (res) {
        
        wx.request({
          //获取openid接口  
          url: 'https://www.onepaychina.com/estate-web/ajax/get-wx-session.do',
          data: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          
          method: 'GET',
          success: function (res) {
            console.log(res)
            OPEN_ID = res.data.openid;//获取到的openid  
            SESSION_KEY = res.data.session_key;//获取到session_key  
            console.log(OPEN_ID)
            
            that.setData({
             
            })
          }
        })
      }
    })
  }  
})







