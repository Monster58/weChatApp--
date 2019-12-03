// pages/home/home.js
const app = getApp()
var OPEN_ID = '' //储存获取到openid  
var SESSION_KEY = '' //储存获取到session_key  
import Toast from '../../libs/vant/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    villageNeme: wx.getStorageSync('villageName'),
    villageId: wx.getStorageSync('villageId'),
    openId: '',
    banner: '',
    bannerRootPath: getApp().globalData.rootHost,
    notices: [],
    myrooms: [],
    toView: 'green',
    cardCur: 0,
    userInfo: '',
    ownerID: ''
  },
  /**
   * 纵向滚动
   * 
   */
  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },

  scroll(e) {
    console.log(e)
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },
  tap() {
    for (let i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        })
        break
      }
    }
  },
  tapMove() {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取openID
    this.getOpenId()
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

    //没有默认小区，跳到新页面选择小区
    // wx.navigateTo({
    //   url: '/pages/login/login'
    // })

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
  jumpToExercise: function() {
    wx.navigateTo({
      url: '/pages/select-room/select-room'
    })
  },
  //获取openID
  getOpenId: function(e) {
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
        var apiUrl = getApp().globalData.host + escape(JSON.stringify(req))
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
            console.log('---getopenID-------' + res);
            OPEN_ID = res.data.body.openID; //获取到的openid  
            SESSION_KEY = res.data.session_key; //获取到session_key  
            console.log("OPEN_ID:" + OPEN_ID)
            wx.setStorage({
              key: "OPEN_ID",
              data: res.data.body.openID,
            })
            that.setData({
              openId: res.data.body.openID,
            })
            if (res.data.action.result != '0000') return console.log('获取用户openid失败')
            //获取用户信息
            that.getUserInfo()
          }
        })
      }
    })
  },
  //获取业主信息
  getUserInfo() {
    console.log('获取用户信息')
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
        that.setData({
          userInfo: res.data,
          ownerID: res.data.body.ownerID
        })
        if (res.data.action.result != '0000') {
          wx.redirectTo({
            url: '/pages/login/login'
          })
          return
        }
        console.log('userInfo===', res.data)
        console.log('ownerID====', that.data.ownerID)
        //获取轮播图
        that.getAd()
        //获取公告列表
        that.getNotices()
      }
    })
  },
  //获取轮播
  getAd: function(vId) {
    let req = {
      "action": {
        "serviceCode": "SC000006"
      },
      "body": {
        "openID": wx.getStorageSync('OPEN_ID'),
        "ownerID": this.data.userInfo.body.ownerID
      }
    }
    const apiUrl = getApp().globalData.host + encodeURI(JSON.stringify(req));
    const that = this;
    wx.request({
      //获取openid接口  
      url: apiUrl,
      data: {

      },
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      method: 'POST',
      success: function(res) {
        that.setData({
          banner: res.data.body.advertList
        })
        console.log('轮播图====', that.data.banner)
        // 初始化towerSwiper 传已有的数组名即可
        that.towerSwiper('banner');
      }
    })
  },
  //轮播跳转
  bannerUrl() {
    console.log('bannerurl')
  },
  //公告列表获取
  getNotices: function(vId) {
    let req = {
      "action": {
        "serviceCode": "SC000008"
      },
      "body": {
        "openID": wx.getStorageSync('OPEN_ID'),
        "ownerID": this.data.userInfo.body.ownerID
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
        console.log(res)

        that.setData({
          notices: res.data.body.noticeList
        })
        console.log('公告列表====', res.data)
      }
    })

  },

  // getMYRooms: function(openId, vId) {
  //   var apiUrl = getApp().globalData.host + "/miniProgramApi/get-my-room.do";
  //   var that = this;
  //   wx.request({
  //     //获取openid接口  
  //     url: apiUrl,
  //     data: {
  //       openId: openId,
  //       villageId: vId,
  //     },
  //     header: {
  //       "content-type": "application/json;charset=UTF-8"
  //     },
  //     method: 'GET',
  //     success: function(res) {
  //       console.log(res)

  //       that.setData({
  //         myrooms: res.data
  //       })

  //     }
  //   })

  // },
  toast() {
    wx.showToast({
      title: '功能开发中，敬请期待！！',
      icon: 'none',
      duration: 2000
    })
  },
  //swiper
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
  /**
   * 开发中提示
   */
  devToast(){
    Toast('功能开发中~');
  }
})