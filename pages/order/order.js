// pages/order.js  
let tmpCRR = [];
var totalNum = 0
var crids = ''
var updatVId = '';
var updateRoomCode = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign: '',
    OPEN_ID: '',
    totalNum: 0,
    crids: '',
    myCR: wx.getStorageSync('myCR')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options+++++++++', options)
    this.setData({
      myCR: wx.getStorageSync('myCR')
    })

    if (this.data.myCR) {} else {
      if (options.villageId) {
        updatVId = options.villageId;
        updateRoomCode = options.roomCode;
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (updateRoomCode) {
      this.searchMyCr(updatVId, updateRoomCode);
    }

    wx.removeStorageSync('myCR')
  },

  //查询欠费记录
  searchMyCr: function(villageId, roomCode) {
    console.log(villageId + "---" + roomCode)
    var that = this;
    var apiUrl = getApp().globalData.host + "/miniProgramApi/get-usr-charge-id.do";
    var vId = villageId;
    wx.setStorage({
      key: "villageId",
      data: vId
    })
    wx.request({
      url: apiUrl,
      data: {
        no: roomCode,
        villageId: vId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log("find cr from server" + res.data)
        console.log(res.data)
        if (res.data) {
          that.setData({
            myCR: res.data,
          })
        } else {
          that.setData({
            //showTopTips: "error",
            //errMsg: "未找到欠费记录"
            yc: 'display: none',
            tis: "未找到欠费记录"
          })
        }

      }
    })
  },
  //随机函数的产生：
  createNonceStr: function() {
    return Math.random().toString(36).substr(2, 15)
  },
  //时间戳产生的函数：

  createTimeStamp: function() {
    return parseInt(new Date().getTime() / 1000) + ''
  },
  backHome: function() {
    wx.navigateTo({
      url: '../home/home',
      success: function(e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
        page.onReady();
      }
    })
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var myCR = this.data.myCR,
      values = e.detail.value;
    for (var i = 0, lenI = myCR.length; i < lenI; ++i) {
      myCR[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (myCR[i].id == values[j]) {
          myCR[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      myCR: myCR
    });
  },

  //发起支付
  pay: function() {
    var tmpCr = this.data.myCR;

    totalNum = 0;
    crids = '';
    for (var i = 0; i < tmpCr.length; i++) {
      if (tmpCr[i].checked == true) {
        totalNum = totalNum + tmpCr[i].realCeceivables;
        crids = crids + tmpCr[i].id + ",";
      }

    }
    if (totalNum == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择待缴费的条目',
        showCancel: false,
        success: function(res) {

        }
      })
      return;
    }
    console.log(totalNum + "---" + crids)

    var apiUrl = getApp().globalData.host + "/miniProgramApi/unifiedorder.do";
    var openId = wx.getStorageSync('OPEN_ID');

    var orderId = "";
    wx.request({
      url: apiUrl,
      data: {
        openId: openId,
        number: totalNum,
        crIds: crids,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log("prepay_id:" + res.data)
        orderId = res.data
        //签名
        var signUrl = getApp().globalData.host + "/miniProgramApi/sign.do";
        //获取当前时间戳  
        var timestamp = parseInt(new Date().getTime() / 1000) + '';
        var nonceStr = Math.random().toString(36).substr(2, 15);
        var sign = '';
        var pag = 'prepay_id=' + orderId;
        console.log("orderId:" + orderId)
        wx.request({
          url: signUrl,
          data: {
            timeStamp: timestamp,
            nonceStr: nonceStr,
            prepay_id: orderId
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            console.log("sign:" + res.data)
            sign = res.data;
            //调用微信支付
            wx.requestPayment({
              'timeStamp': timestamp,
              'nonceStr': nonceStr,
              'package': pag,
              'signType': 'MD5',
              'paySign': sign,
              'success': function(res) {
                console.log("pay sucess:" + res.errMsg)
                var apiUrl = getApp().globalData.host + "/miniProgramApi/record-pay-result.do";
                wx.request({
                  url: apiUrl,
                  data: {
                    upOrderId: orderId,
                    upCode: 'ok',
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function(res) {
                    wx.navigateTo({
                      url: '../pay-result/pay-result'
                    })
                  }
                })
              },
              'fail': function(res) {
                console.log("pay fail:" + res.err_desc)
                wx.showModal({
                  title: '提示',
                  content: '支付失败，' + res.err_desc,
                  showCancel: false,
                  success: function(res) {

                  }
                })
              },
              'complete': function(res) {}
            })
          }
        })
      }
    })
  }
})