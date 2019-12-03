// pages/myroom/myroom.js
const app = getApp()
var SESSION_KEY = ''//储存获取到session_key 
var OPEN_ID = ''//储存获取到openid 
var USR_VILLAGE = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    myRooms: [],
    villageIndex: 0,
  },
  //选择小区
  bindPickerChange_hx: function (e) {
    var that = this;
    that.setData({   //给变量赋值
      villageIndex: e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致    
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getMyvillages();
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
            wx.setStorage({
              key: "OPEN_ID",
              data: res.data.openid
            })
            that.setData({
              openId: res.data.openid,
            })

          }
        })
      }
    })
  },
  getMyvillages: function (e) {
    var that = this;
  
    var apiUrl = getApp().globalData.host + "/miniProgramApi/get-my-room.do";
    wx.request({
      url: apiUrl,
      data: {
        openId: wx.getStorageSync('OPEN_ID'),
        villageId:0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("myRooms:"+res.data)
        USR_VILLAGE = res.data;
        that.setData({
          myRooms: res.data,
        })
       
      }
    })
  },
  selectOneVillage: function (e) {
   
    wx.setStorage({
      key: "villageId",
      data: this.data.myRooms[this.data.villageIndex].villageId
    });
    wx.setStorage({
      key: "villageName",
      data: this.data.myRooms[this.data.villageIndex].villageName
    });
    
    wx.switchTab({
      url: '../../pages/home/home',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad(); 
        page.onReady();
      }
    })
  
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (!USR_VILLAGE){
      wx.navigateTo({
        url: '/pages/bind-room/bind-room'
      })
    }
    
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