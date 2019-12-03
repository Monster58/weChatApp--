// pages/pay-hitory/pay-history.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expenseList: '',
    noInfo: null
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
          this.getHistory();
        })
      })
    } else {
      this.getHistory();
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  onPullDownRefresh() {
    // wx.showNavigationBarLoading();
    this.getHistory().then(() => {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }).catch(() => {
      wx.stopPullDownRefresh();
    })
  },
  getHistory: function() {
    return new Promise((resolve, reject) => {
      let req = {
        "action": {
          "serviceCode": "SC000018"
        },
        "body": {
          "openID": wx.getStorageSync('OPEN_ID'),
          "ownerID": wx.getStorageSync('USERINFO').ownerID
        }
      }
      const apiUrl = getApp().globalData.host + encodeURI(JSON.stringify(req));
      const that = this;
      wx.request({
        url: apiUrl,
        data: {

        },
        header: {
          "content-type": "application/json;charset=UTF-8"
        },
        method: 'POST',
        success: function(res) {
          resolve()
          console.log('缴费记录res.data',res.data)
          if(res.data.action.result != '0000') {
            that.setData({
              noInfo: '暂无缴费记录'
            })
            return
          }
          that.setData({
            expenseList: res.data.body.expenseList
          })
          console.log('缴费记录====', that.data.expenseList)
        }
      })
    })
  },

})