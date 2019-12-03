const app = getApp()
const OPEN_ID = wx.getStorageSync('OPEN_ID') //储存获取到openid
import Notify from '../../libs/vant/notify/notify';
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    testPhoneCode: '',
    villageNeme: wx.getStorageSync('villageName'),
    villageId: wx.getStorageSync('villageId'),
    userInfo: '',
    username: '',
    phoneNumber: '',
    certNO: '',
    msgCode: '',
    phoneNO: ''
  },
  msgCodeChange(e) {
    this.data.msgCode = e.detail.value;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //判断有没有OPEN_ID
    if (!wx.getStorageSync('OPEN_ID')) {
      app.getOpenId().then(() => {
        app.getUserInfo().then(() => {
          console.log('bind-room')
          //获取用户信息
          this.getUserInfo()
        })
      })
    } else {
      //获取用户信息
      this.getUserInfo()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获取手机验证码
  getPhoneCode() {
    /**
     * 自动填充测试验证码，后台不校验
     */
    this.setData({
      msgCode: '0000'
    })
    return
    /**
     * 生产环境将以上删除
     */
    let req = {
      "action": {
        "serviceCode": "SC000003"
      },
      "body": {
        "phoneNO": this.data.phoneNO,
        "busInfo": "1"
      }
    }
    // return console.log(req)
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
      success: function(res) {
        console.log('phonecode===', res.data)
        if (res.data.action.result != '0000') {
          Notify({
            type: 'danger',
            message: `验证码获取失败`
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
  //获取业主信息
  getUserInfo() {
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
      //获取openid接口  
      url: apiUrl,
      data: {},
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      method: 'POST',
      success: function(res) {
        if (res.data.action.result != '0000') {
          Notify({
            type: 'danger',
            message: `获取用户信息失败`
          });
          return
        }
        that.setData({
          userInfo: res.data.body,
          phoneNO: res.data.body.phoneNO
        })
        console.log('userinfo===', that.data.userInfo)
      }
    })
  },
  //用户解绑
  unBindUser() {
    let req = {
      "action": {
        "serviceCode": "SC000004",
      },
      "body": {
        "openID": OPEN_ID,
        "phoneNO": `${this.data.userInfo.phoneNO}`,
        "ownerNam": `${this.data.userInfo.ownerNam}`,
        "certNO": `${this.data.userInfo.certNO}`,
        "actFlag": "1",
        "msgCode": `${this.data.msgCode}`,
        "busInfo": "1"
      }
    }
    console.log('解绑req===', req)
    const that = this
    const apiUrl = getApp().globalData.host + encodeURI(JSON.stringify(req));
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
          Notify({
            type: 'danger',
            message: `${res.data.action.message}`
          });
          return
        }
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    })
  }
})