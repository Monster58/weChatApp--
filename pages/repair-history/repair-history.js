// // pages/repair-history/repair-history.js
// // pages/new-repair/new-repair.js
// import Notify from '../../libs/vant/notify/notify';
// var USR_VILLAGE = [];
// Page({

//   /**
//    * 页面的初始数据 
//    */
//   data: {
//     repairList: [
//       {
//         title:'报修标题1',
//         imgUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4052801177,1622529651&fm=26&gp=0.jpg',
//         desc: '报修内容描述',
//         state: true
//       },
//       {
//         title: '报修标题2',
//         imgUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4052801177,1622529651&fm=26&gp=0.jpg',
//         desc: '报修内容描述',
//         state: false
//       },
//       {
//         title: '报修标题3',
//         imgUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4052801177,1622529651&fm=26&gp=0.jpg',
//         desc: '报修内容描述',
//         state: true
//       }
//     ]
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })
// pages/new-repair/new-repair.js
import Notify from '../../libs/vant/notify/notify';
var USR_VILLAGE = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    input_hold: '',
    myRooms: [],
    villageIndex: 0,
    img_arr: [],
    id: 0,
    title: '',
    phone: '',
    content: '',
    formdata: '',
    fileList: [],
    img_arr_base64: [],
    bannerRootPath: getApp().globalData.rootHost
  },
  //选择小区
  bindPickerChange_hx: function (e) {
    var that = this;
    that.setData({ //给变量赋值
      villageIndex: e.detail.value, //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致    
    })
    console.log("e.detail.value.villageIndex:" + e.detail.value)
  },

  getMyRooms: function (e) {
    // var apiUrl = getApp().globalData.host + "/miniProgramApi/get-my-room.do";
    // wx.request({
    //   url: apiUrl,
    //   data: {
    //     openId: wx.getStorageSync('OPEN_ID'),
    //     villageId: wx.getStorageSync('villageId')
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function(res) {
    //     console.log("myRooms:" + res.data)
    //     USR_VILLAGE = res.data;
    //     that.setData({
    //       myRooms: res.data,
    //     })

    //   }
    // })
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
    console.log(req)
    const apiUrl = getApp().globalData.host + encodeURI(JSON.stringify(req));
    console.log(apiUrl)
    const that = this
    wx.request({
      //获取openid接口  
      url: apiUrl,
      data: {
      },
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      method: 'POST',
      success: function (res1) {
        that.setData({
          userInfo: res1.data
        }),
          console.log('userInfo===', that.data.userInfo),
          //获取物业
          console.log('获取myroom')
        let req = {
          "action": {
            "serviceCode": "SC000014"
          },
          "body": {
            "openID": wx.getStorageSync('OPEN_ID'),
            "ownerID": that.data.userInfo.body.ownerID
          }
        }
        console.log(req)
        const apiUrl = getApp().globalData.host + encodeURI(JSON.stringify(req));
        wx.request({
          //获取openid接口  
          url: apiUrl,
          data: {
          },
          header: {
            "content-type": "application/json;charset=UTF-8"
          },
          method: 'POST',
          success: function (resroom) {
            that.setData({ repairList: resroom.data.body.repairList })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyRooms();
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
    this.getUserInfo()
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