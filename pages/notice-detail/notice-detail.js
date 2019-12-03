// pages/notice-detail/notice-detail.js
var WxParse = require('../wxParse/wxParse.js');
const OPEN_ID = wx.getStorageSync('OPEN_ID') //储存获取到openid   
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: '',
    name: '',
    showTopTips: "",
    errMsg: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      console.log('options.id===', options.id)
      this.getNoticeDetail(options.id, options.ownerID);
    }
  },
  getNoticeDetail: function(noticeId, ownerID) {
    let req = {
      "action": {
        "serviceCode": "SC000009"
      },
      "body": {
        "openID": wx.getStorageSync('OPEN_ID'),
        "ownerID": ownerID,
        "noticeID": noticeId
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
        console.log("find notice detail from server", res.data)
        if (res.data) {
          that.setData({
            msg: res.data.body.noticeNam,
            // name: res.data.noticeNam,
            // date: res.data.publicTime
          })
          WxParse.wxParse('article', 'html', res.data.body.noticeInfo, that, 5);
        } else {
          that.setData({
            showTopTips: "error",
            errMsg: "未找到公告详情"
          })
        }

      }
    })
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

  }
})