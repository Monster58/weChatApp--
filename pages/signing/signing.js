// pages/Signing/Signing.js
import Toast from '../../libs/vant/toast/toast';
import Notify from '../../libs/vant/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker: ['身份证', '护照', '军官证', '士兵证', '回乡证', '临时身份证', '户口簿', '警官证', '台胞证', '营业执照', '其他证件'],
    result: ['a', 'b'],
    name: '',
    idCardNum: '',
    cardNum: '',
    phoneNum: '',
    msgCode: '',
    index: 1,
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  nameChange(e) {
    this.data.name = e.detail.value;
  },
  idCardNumChange(e) {
    this.data.idCardNum = e.detail.value;
  },
  cardNumChange(e) {
    this.data.cardNum = e.detail.value;
  },
  phoneNumChange(e) {
    this.data.phoneNum = e.detail.value;
  },
  msgCodeChange(e) {
    this.data.msgCode = e.detail.value;
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
          // this.getSigningType();
        })
      })
    } else {
      // this.getSigningType();
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
  // 复选框
  onChange(event) {
    this.setData({
      result: event.detail
    });
  },
  //获取手机验证码
  getPhoneCode() {
    if (this.data.phoneNum == '') {
      Notify({
        type: 'danger',
        message: '请输入手机号'
      });
      return
    }
    let req = {
      "action": {
        "serviceCode": "SC000003"
      },
      "body": {
        "phoneNO": `${this.data.phoneNum}`,
        "busInfo": "2"
      }
    }
    const apiUrl = getApp().globalData.host + escape(JSON.stringify(req));
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
        if (res1.data.action.result != '0000') {
          Notify(res1.data.action.message);
          return
        }
        console.log('手机验证码===', res1.data.body.telCode)
        Notify({
          type: 'success',
          message: res1.data.action.message,
          duration: 2000
        });
      }
    })
  },
  //绑定银行卡
  signingCard() {
    if (this.data.name === '') {
      Notify('请输入姓名');
      return
    } else if (this.data.idCardNum === '') {
      Notify('请输入证件号');
      return
    } else if (this.data.cardNum === '') {
      Notify('请输入银行卡号');
      return
    } else if (this.data.cardNum === '') {
      Notify('请输入手机号');
      return
    } else if (this.data.cardNum === '') {
      Notify('请输入验证码');
      return
    }
    const that = this
    return new Promise((resolve, reject) => {
      let req = {
        "action": {
          "serviceCode": "SC000020"
        },
        "body": {
          "openID": wx.getStorageSync('OPEN_ID'),
          "ownerID": wx.getStorageSync('USERINFO').ownerID,
          "accName": this.data.name,
          "accNO": this.data.cardNum,
          "certTyp": this.data.index,
          "certNO": this.data.idCardNum,
          "phoneNO": this.data.phoneNum,
          "msgCode": this.data.msgCode,
          "busInfo": "2",
          "actFlag": "0"
        }
      }
      // return console.log(req)
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
          console.log('绑定结果===', res.data)
          if(res.data.action != '0000') {
            Notify({
              type: 'danger',
              message: res.data.action.message,
              duration: 2000
            })
          }
          resolve()
        }
      })
    })
  }
})