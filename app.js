//app.js

App({
  globalData: {
    appid: 'wxc7ac12f1f645c248', //appid需自己提供，此处的appid我随机编写
    secret: '65ec7ee9c1c08e9a68f0ac8aa4c4850a', //secret需自己提供，此处的secret我随机编写
    userInfo: null,
    // 测试域名： http://52.80.13.163:7116
    // 生产域名： https://zhsq.jnrcbank.com.cn
    // 信安物业APPID： wxc7ac12f1f645c248
    // 农商e家园APPID： wxb0c54f9db699ee7c
    host: "http://52.80.13.163:7116/sc/mobileService?switch_json=",
    rootHost: 'http://52.80.13.163:7116',
    /**
     * 测试环境验证码-点击获取验证码直接填充验证码，后台不校验。
     */
    testPhoneCode: '0000'
  },
  onShow: function() {
    var that = this
    this.getOpenId().then(() => {
      console.log('获取openID成功')
      this.getUserInfo()
    })
  },

  // onLaunch: function() {
  //   var that = this
  //   this.getOpenId().then(() => {
  //     console.log('获取openID成功')
  //     this.getUserInfo()
  //   })
  // },
  //获取openID
  getOpenId: function(e) {
    return new Promise((resolve, reject) => {
      var that = this;
      wx.login({
        success: function(res) {
          let req = {
            "action": {
              "serviceCode": "SC000001"
            },
            "body": {
              "code": `${res.code}`
            }
          }
          console.log('用户code===', res.code)
          var apiUrl = getApp().globalData.host + encodeURI(JSON.stringify(req))
          console.log(apiUrl)
          console.log('获取用户openid中.....')
          wx.request({
            //获取openid接口  
            url: apiUrl,
            data: {},
            header: {
              "content-type": "application/json;charset=UTF-8"
            },
            method: 'POST',
            success: function(res) {
              console.log("APP.JS=OPEN_ID:" + res.data.body.openID)
              wx.setStorage({
                key: "OPEN_ID",
                data: res.data.body.openID,
              })
              if (res.data.action.result != '0000') return console.log('获取用户openid失败')
              resolve()
            },
            fail() {
              console.log('error!!!!!!!')
            }
          })
          console.log('发送获取openID请求')
        }
      })
    })
  },
  //获取业主信息
  getUserInfo() {
    return new Promise((resolve, reject) => {
      let req = {
        "action": {
          "serviceCode": "SC000002"
        },
        "body": {
          "openID": wx.getStorageSync('OPEN_ID')
        }
      }
      const apiUrl = getApp().globalData.host + encodeURI(JSON.stringify(req));
      const that = this
      wx.request({
        url: apiUrl,
        data: {},
        header: {
          "content-type": "application/json;charset=UTF-8"
        },
        method: 'POST',
        success: function(res) {
          if (res.data.action.result != '0000') {
            wx.redirectTo({
              url: '/pages/login/login'
            })
            return
          }
          wx.setStorage({
            key: "USERINFO",
            data: res.data.body,
          })
          resolve()
          console.log('APP.JSuserInfo===', wx.getStorageSync('USERINFO'))
        }
      })
    })
  },
})