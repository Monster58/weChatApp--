
//获取应用实例
const app = getApp()
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  

Page({
  data: {
    motto: 'ccccc',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
   
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

    this.getOpenId();
 
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getOpenId: function (e) {
    var apiUrl = getApp().globalData.host + "/miniProgramApi/get-wx-session.do";
    var that = this;
    wx.login({

      success: function (res) {

        wx.request({
          //获取openid接口  
          url: apiUrl,
          data: {
            js_code: res.code,
            grant_type: 'authorization_code'
          },

          method: 'GET',
          success: function (res) {
            console.log(res)
            OPEN_ID = res.data.openid;//获取到的openid  
            SESSION_KEY = res.data.session_key;//获取到session_key  
            console.log(OPEN_ID)

            wx.setStorage({
              key: "OPEN_ID",
              data: res.data.openid
            })

          }
        })
      }
    })
  },

  viewPayHistory: function (e) {
    wx.switchTab({
      url: '/pages/pay-history/pay-history',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
        page.onReady();
      }
    })
  },
  
})
