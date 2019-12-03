// pages/notice/notice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notices: [],
    ownerID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取ownerID
    if(wx.getStorageSync('USERINFO')){
      this.setData({
        ownerID: wx.getStorageSync('USERINFO').ownerID
      })
    }
    //判断有没有OPEN_ID
    if (!wx.getStorageSync('OPEN_ID')) {
      app.getOpenId().then(() => {
        app.getUserInfo().then(() => {
          console.log('bind-room')
           this.getNotices()
        })
      })
    } else {
       this.getNotices()
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

  //getnotice
  getNotices: function() {
    let req = {
      "action": {
        "serviceCode": "SC000008"
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
        console.log(res.data)
        that.setData({
          notices: res.data.body.noticeList
        })
        console.log('公告列表res.data.body===', res.data.body)
      }
    })
  },
})