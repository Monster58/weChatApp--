// pages/signing-item/signing-item.js
import Notify from '../../libs/vant/notify/notify'; 
Page({
  /**
   * 页面的初始数据 
   */
  data: {
    list: ['a', 'b', 'c'],
    result: [],
    chargeTyp: '',
    propertyList: '',
    propertyListLength: ''
  },
  onChange(event) {
    this.setData({
      result: event.detail
    });
    console.log(this.data.result)
  },
  toggle(event) {
    const {
      index
    } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
  noop() {},

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function(options) {
    this.setData({
      chargeTyp: options.chargeTyp
    })
    //判断有没有OPEN_ID
    if (!wx.getStorageSync('OPEN_ID')) {
      app.getOpenId().then(() => {
        app.getUserInfo().then(() => {
          console.log('bind-room')
          this.getPropertyList()
        })
      })
    } else {
      this.getPropertyList()
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
  //获取物产列表
  getPropertyList: function() {
    let req = {
      "action": {
        "serviceCode": "SC000024"
      },
      "body": {
        "openID": wx.getStorageSync('OPEN_ID'),
        "ownerID": wx.getStorageSync('USERINFO').ownerID,
        "chargeTyp": this.data.chargeTyp
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
        let arr = []
        res.data.body.propertyList.forEach(e => {
          if (e.signSta === '0') {
            arr.push(e)
          }
        })
        if (arr.length) {
          that.setData({
            propertyListLength: true
          })
        } else {
          that.setData({
            propertyListLength: false
          })
        }
        that.setData({
          propertyList: arr
        })
        that.setData({
          propertyList: arr
        })
        console.log('未签约物产列表===', that.data.propertyList)
      }
    })
  },
  //提交签约物产
  submit() {
    let current = []
    this.data.result.forEach(e => {
      this.data.propertyList.forEach(i => {
        if (i.propertyID === e) {
          const arrItem = {
            propertyID: i.propertyID,
            propertyTyp: i.propertyTyp
          }
          current.push(arrItem)
        }
      })
    })
    let req = {
      "action": {
        "serviceCode": "SC000025"
      },
      "body": {
        "openID": wx.getStorageSync('OPEN_ID'),
        "ownerID": wx.getStorageSync('USERINFO').ownerID,
        "chargeTyp": this.data.chargeTyp,
        "propertyList": current,
        "actFlag": "0"
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
        if (res.data.action.result != "0000") {
          Notify({ type: 'danger', message: res.data.action.message });
          return
        }
        that.setData({
          result: []
        })
        that.getPropertyList()
        console.log(res.data)
      }
    })
  }
})