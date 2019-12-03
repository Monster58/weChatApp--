const app = getApp()
const OPEN_ID = wx.getStorageSync('OPEN_ID') //储存获取到openid
var selectRoomCode = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    myrooms: [1,2],
    active: 0,
    propertyList: '',
    roomType: ['商铺','房屋','车位'],
    communityList: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    //判断有没有OPEN_ID
    if (!wx.getStorageSync('OPEN_ID')) {
      app.getOpenId().then(() => {
        app.getUserInfo().then(()=>{
          console.log('bind-room')
          this.getCommunityList()
        })
      })
    } else {
      this.getCommunityList()
    }
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
  //获取小区列表
  getCommunityList() {
    let req = {
      "action": {
        "serviceCode": "SC000015"
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
      success: function (res) {
        that.setData({
          communityList: res.data.body.communityList
        })
        console.log('社区列表====', that.data.communityList)
        that.getRoomList()
      }
    })
  },
  //获取物产信息
  getRoomList(communityID){
    let comId
    if (communityID){
      comId = communityID
    } else {
      comId = this.data.communityList[0].communityID
    }
    let req = {
      "action": {
        "serviceCode": "SC000016"
      },
      "body": {
        "openID": wx.getStorageSync('OPEN_ID'),
        "ownerID": wx.getStorageSync('USERINFO').ownerID,
        "communityID": comId
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
      success: function (res) {
        that.setData({
          propertyList: res.data.body.propertyList
        })
        console.log('物产信息====', that.data.propertyList)
      }
    })
  },
  changeTab(e){
    const comId = this.data.communityList[e.detail.name].communityID
    this.getRoomList(comId)
  }
})