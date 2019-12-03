// pages/pay-history-item/pay-history-item.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expenseID: '',
    propertyList: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        expenseID: options.id
      })
      console.log('expenseID===', this.data.expenseID)
    }
    //判断有没有OPEN_ID
    if (!wx.getStorageSync('OPEN_ID')) {
      app.getOpenId().then(() => {
        app.getUserInfo().then(() => {
          console.log('bind-room')
          this.getPayHistoryItem();
        })
      })
    } else {
      this.getPayHistoryItem();
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
  onPullDownRefresh: function() {

  },

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
  //获取缴费记录明细
  getPayHistoryItem() {
    console.log('缴费id===', this.data.expenseID)
    let req = {
      "action": {
        "serviceCode": "SC000019"
      },
      "body": {
        "openID": wx.getStorageSync('OPEN_ID'),
        "ownerID": wx.getStorageSync('USERINFO').ownerID,
        "expenseID": this.data.expenseID
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
        that.setData({
          propertyList: res.data.body.propertyList
        })
        console.log('缴费记录明细===', that.data.propertyList)
      }
    })
  }
})