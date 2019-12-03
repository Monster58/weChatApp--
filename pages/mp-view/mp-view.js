// pages/mp-view/mp-view.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     villageId:0,
     mobile:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var  that = this;
    var scene = decodeURIComponent(options.scene)
    var sceneArray = scene.split("-");
    that.setData({
      mobile: sceneArray[0],
      villageId: sceneArray[1]
    })

    var apiUrl = getApp().globalData.host + "/miniProgramApi/get-usr-charge-id.do";
    
    wx.setStorage({
      key: "villageId",
      data: villageId
    })
    wx.request({
      url: apiUrl,
      data: {
        no: mobile,
        villageId: vId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data) {
          wx.setStorage({
            key: "mobile",
            data: e.detail.value.mobile
          })

          wx.setStorage({
            key: "myCR",
            data: res.data
          })
          wx.navigateTo({
            url: '/pages/order/order'
          })
        } else {
          that.setData({
            showTopTips: "error",
            errMsg: "未找到欠费记录"
          })
        }

      }
    })



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})