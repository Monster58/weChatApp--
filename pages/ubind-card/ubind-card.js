// pages/Signing/Signing.js
import Toast from '../../libs/vant/toast/toast';
import Notify from '../../libs/vant/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker: ['身份证', '护照', '军官证', '士兵证', '回乡证', '临时身份证', '户口簿', '警官证', '台胞证', '营业执照', '其他证件'],
    accName: '', //姓名
    certTyp: 1, //证件类型
    certNO: '', //证件号
    accNO: '', //银行卡号
    phoneNO: '', //手机号
    msgCode: '',
    accID: '',
    certTypIndex: ''
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
          this.getCardList();
        })
      })
    } else {
      this.getCardList();
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
          // return
          if (res.data.action.result != '0000') {
            // 获取失败提醒
            return
          }
          const userInfo = res.data.body.accList[0]
          that.setData({
            accName: userInfo.accName, //姓名
            certTyp: that.data.picker[userInfo.certTyp * 1 - 1], //证件类型
            certTypIndex: userInfo.certTyp,
            certNO: userInfo.certNO, //证件号
            accNO: userInfo.accNO, //银行卡号
            phoneNO: userInfo.phoneNO, //手机号
            accID: userInfo.accID, //银行卡ID

          })
          console.log('银行卡列表====', res.data.body.accList)
        },
        fail() {
          console.log('error!!!!')
        }
      })
    })
  },
  //获取手机验证码
  getPhoneCode() {
    /**
     * 自动填充测试验证码，后台不校验
     */
    this.setData({
      msgCode: '0000'
    })
    return
    /**
     * 生产环境将以上删除
     */
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
        "busInfo": "3"
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
  //解绑银行卡
  ubindCard() {
    if (this.data.cardNum === '') {
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
          "accName": this.data.accName,
          "accNO": this.data.accNO,
          "certTyp": this.data.certTypIndex, //
          "certNO": this.data.certNO,
          "phoneNO": this.data.phoneNO,
          "msgCode": this.data.msgCode,
          "busInfo": "3",
          "actFlag": "1"
        }
      }
      // return 
      console.log(req)
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
          console.log('解绑结果===', res.data)
          if (res.data.action != '0000') {
            Notify({
              type: 'danger',
              message: res.data.action.message,
              duration: 2000
            })
            return
          }
          wx.redirectTo({
            url: '/pages/signing/signing',
          })
        }
      })
    })
  }
})