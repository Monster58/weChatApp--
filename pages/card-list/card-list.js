// pages/card-list/card-list.js
import Dialog from '../../libs/vant/dialog/dialog';
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    cardList: [],
    loading: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //判断有没有OPEN_ID
    if (!wx.getStorageSync('OPEN_ID')) {
      app.getOpenId().then(() => {
        app.getUserInfo().then(() => {
          console.log('bind-room')
          this.getCardList()
          .then(()=>{
            this.switchGo()
          })
        })
      })
    } else {
      this.getCardList()
      .then(()=>{
        this.switchGo()
      })
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
  //获取银行卡列表
  getCardList() {
    return new Promise((resolve, reject) => {
      let req = {
        "action": {
          "serviceCode": "SC000026"
        },
        "body": {
          "openID": wx.getStorageSync('OPEN_ID'),
          "ownerID": wx.getStorageSync('USERINFO').ownerID
        }
      }
      const apiUrl = getApp().globalData.host + encodeURI(JSON.stringify(req));
      const that = this;
      console.log('获取银行卡列表')
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
          // return
          if (res.data.action.result != '0000') {
            wx.redirectTo({
              url: '/pages/signing/signing'
            })
            return
          }
          that.setData({
            cardList: res.data.body.accList
          })
          console.log('银行卡列表====', res.data.body.accList)
        },
        fail() {
          console.log('error!!!!')
        }
      })
    })
  },
  //绑定银行卡
  addCard() {
    wx.navigateTo({
      url: '/pages/signing/signing'
    })
  },
  //解绑
  handleUntying(e) {
    console.log(e.currentTarget.dataset.info)
    Dialog.confirm({
        // title: '解绑',
        message: '确定解除此银行卡吗？',
        asyncClose: true
      })
      .then(() => {
        // Dialog.close();
        return new Promise((resolve, reject) => {
          let req = {
            "action": {
              "serviceCode": "SC000020"
            },
            "body": {
              "openID": wx.getStorageSync('OPEN_ID'),
              "ownerID": wx.getStorageSync('USERINFO').ownerID
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
              console.log('收费类目查询===', res.data)
              resolve()
            }
          })
        })
      })
      .catch(() => {
        Dialog.close();
      });
  },
  //判断是否跳转
  switchGo() {
    if (this.data.cardList.length == 0) {
      wx.redirectTo({
        url: '/pages/signing/signing'
      })
      return
    }
  },
  //跳转解绑页面
  handleUbindCard(){
    wx.redirectTo({
      url: '/pages/ubind-card/ubind-card',
    })
  }
})