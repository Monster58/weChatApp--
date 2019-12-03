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
    urgentLevel: ["一般", "紧急"],
    urgentLevelIndex: 0,
  },
  //紧急程度
  bindUrgentLevelChange: function (e) {
    console.log('picker cardTypes 发生选择改变，携带值为', e.detail.value);
    this.setData({
      urgentLevelIndex: e.detail.value
    })
  },
  //选择小区
  bindPickerChange_hx: function(e) {
    var that = this;
    that.setData({ //给变量赋值
      villageIndex: e.detail.value, //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致    
    })
    console.log("e.detail.value.villageIndex:" + e.detail.value)
  },
  upimg: function() {
    var that = this;
    if (this.data.img_arr.length < 3) {
      wx.chooseImage({
        count: 1, //最多可以选择的图片总数  
        sizeType: ['original', 'compressed'],
        success: function(res) {
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
          var imagearr = res.tempFilePaths[0].split(".")
          var ptype = imagearr[imagearr.length - 1]
          console.log(ptype);
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0],
            encoding: "base64",
            success: function(data) {
              console.log("图片转码")
              console.log(data) //返回base64编码结果，但是图片的话没有data:image/png
              that.setData({
                img_arr_base64: that.data.img_arr_base64.concat(ptype + ";base64" + data.data)
              })
            }
          })
        }
      })
    } else {
      // 警告通知
      Notify({
        type: 'danger',
        message: '最多上传三张图片'
      });
    }
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
      success: function(res1) {
        that.setData({
          userInfo: res1.data
        })
        //获取物业
        let req = {
          "action": {
            "serviceCode": "SC000023"
          },
          "body": {
            "openID": wx.getStorageSync('OPEN_ID'),
            "ownerID": that.data.userInfo.body.ownerID
          }
        }
        const apiUrl = getApp().globalData.host + encodeURI(JSON.stringify(req));
        wx.request({
          //获取openid接口  
          url: apiUrl,
          data: {},
          header: {
            "content-type": "application/json;charset=UTF-8"
          },
          method: 'POST',
          success: function (resroom) {
            console.log('房屋列表==', resroom.data)
            that.setData({
              myRooms: resroom.data.body.propertyList
            })
          }
        })
      }
    })
  },
  newRepair: function(e) {
    var that = this;
    var cars = this.data.img_arr
    //var apiUrl = getApp().globalData.host;
    if (e.detail.value.title == '') {
      // 警告通知
      Notify({
        type: 'danger',
        message: '请填写标题！'
      });
      return false
    }
    if (e.detail.value.phone == '') {
      Notify({
        type: 'danger',
        message: '请填写联系电话！'
      });
      return false
    }
    //获取物业
    let req = {
      "action": {
        "serviceCode": "SC000013"
      },
      "body": {
        "openID": wx.getStorageSync('OPEN_ID'),
        "ownerID": that.data.userInfo.body.ownerID,
        "propertyTyp": that.data.myRooms[that.data.villageIndex].propertyTyp,
        "propertyID": that.data.myRooms[that.data.villageIndex].propertyID,
        "communityID": that.data.myRooms[that.data.villageIndex].communityID,
        "relationNam": e.detail.value.name,
        "relationPhoneNO": e.detail.value.phone,
        "repairNam": e.detail.value.title,
        "repairDes": e.detail.value.content,
        "urgentLevel": this.data.urgentLevelIndex,
        "photo1": that.data.img_arr_base64[0],
        "photo2": that.data.img_arr_base64[1],
        "photo3": that.data.img_arr_base64[2],
      }
    }
    const apiUrl = getApp().globalData.host + encodeURI(JSON.stringify(req));
    wx.request({
      //获取openid接口  
      url: apiUrl,
      data: {},
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      method: 'POST',
      success: function(result) {
        console.log(result)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getMyRooms();
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
    this.getUserInfo()
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