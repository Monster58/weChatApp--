const app = getApp()
var OPEN_ID = '' //储存获取到openid  
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    propertyList: "",
    subAllAmount: '',
    list: ['a', 'b', 'c'],
    result: ["0000000008", "0000000012", "0000000010", "0000000009"],
    singing: '', //总金额
    noInfo: null
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
          this.getPayList();
        })
      })
    } else {
      this.getPayList();
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
    this.getPayList().then(() => {
        wx.stopPullDownRefresh();
      })
      .catch(() => {
        wx.stopPullDownRefresh();
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  //获取缴费信息
  getPayList() {
    return new Promise((resolve, reject) => {
      let req = {
        "action": {
          "serviceCode": "SC000017"
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
        success: function(res) {
          resolve()
          if (res.data.action.result != '0000') {
            that.setData({
              noInfo: '暂无缴费信息'
            })
            return
          }
          let amountID = 0
          let arr = []
          res.data.body.propertyList.forEach(e => {
            e.chargeTypList.forEach(i => {
              i.amountID = (amountID++).toString()
              arr.push(i.amountID)
            })
          })
          that.setData({
            propertyList: res.data.body.propertyList,
            result: arr
          })
          that.totalComputation()
          console.log('缴费信息查询====', that.data.propertyList)
        }
      })
    })
  },
  //复选框相关
  onChange(event) {
    this.setData({
      result: event.detail
    });
    console.log(this.data.result)
    this.totalComputation()
  },

  toggle(event) {
    const {
      index
    } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  noop() {},
  //计算总额
  totalComputation() {
    let allMoney = 0
    console.log(allMoney)
    this.data.result.forEach(e => {
      this.data.propertyList.forEach(i => {
        i.chargeTypList.forEach(c => {
          if (e === c.amountID) {
            console.log(c)
            let count = c.amount
            allMoney += count *= 100
          }
        })
      })
    })
    console.log(allMoney)
    allMoney = allMoney / 100
    console.log(allMoney)
    this.setData({
      singing: allMoney
    })
    console.log('总金额为：', this.data.singing)
  },
  //提交订单给后台
  onSubmit() {
    console.log('提交订单')
    return new Promise((resolve, reject) => {
      let req = {
        "action": {
          "serviceCode": "SC000022"
        },
        "body": {
          "openID": wx.getStorageSync('OPEN_ID'),
          "ownerID": wx.getStorageSync('USERINFO').ownerID,
          "chargeAllAmount": this.data.singing,
          "propertyList": []
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
          resolve()
          if (res.data.action.result != '0000') {

            return
          }

        }
      })
    })
  },
  //发送支付请求-小程序
  processPay() {
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success(res) {
        console.log("wx.requestPayment返回信息", res);
      },
      fail(res) {
        console.log("支付失败");
      },
      complete: function () {
        console.log("支付完成(成功或失败都为完成)");
      }
    })
  }
})