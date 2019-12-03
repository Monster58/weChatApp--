//index.js
//获取应用实例
const app = getApp()
const OPEN_ID = wx.getStorageSync('OPEN_ID') //储存获取到openid
var SESSION_KEY = '' //储存获取到session_key  
var villages = []
var villageIndex = 0 
var isAgree = 1
var villageId = 0
Page({
  data: {
    userName: '',
    phoneNum: '',
    cardtypes: ["居民身份证", "护照", "军官证", "士兵证", "回乡证", "临时身份证", "户口簿", "警官证", "台胞证", "营业执照", "其他证件"],
    cardtypeIndex: 0,
    idCNum: '',//身份证号
    loanAmount: '',//申请金额
    purpose: '', //用途
    times: ["1个月", "3个月", "6个月", "9个月", "12个月", "24个月", "36个月"],
    timeIndex: 0,
    loanModes: ["个人", "企业"],
    loanModeIndex: 0,
    userInfo: '',
    ownerID: ''
  },
  //姓名
  userNameChange(e){
    this.setData({
      userName: e.detail.value
    })
  },
  //手机号
  phoneNumChange(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  //证件类型
  bindCardTypesChange: function(e) {
    console.log('picker cardTypes 发生选择改变，携带值为', e.detail.value);
    this.setData({
      cardtypeIndex: e.detail.value
    })
  },
  //证件号
  idNumChange(e) {
    this.setData({
      idCNum: e.detail.value
    })
  },
  //申请金额
  amountChange(e) {
    this.setData({
      loanAmount: e.detail.value
    })
  },
  //用途
  purposeChange(e) {
    this.setData({
      purpose: e.detail.value
    })
  },
  // 时间
  bindTimeChange: function(e) {
    console.log('picker time 发生选择改变，携带值为', e.detail.value);
    this.setData({
      timeIndex: e.detail.value
    })
  },
  //贷款形式
  bindLoanModeChange: function(e) {
    console.log('picker LoanMode 发生选择改变，携带值为', e.detail.value);
    this.setData({
      loanModeIndex: e.detail.value
    })
  },
  onLoad: function(options) {
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },
  onLoad: function () {
    console.log('onload')
    this.getUserInfo()
  },
  //获取业主信息
  getUserInfo() {
    console.log('贷款页面获取用户信息')
    let req = {
      "action": {
        "serviceCode": "SC000002"
      },
      "body": {
        "openID": OPEN_ID
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
      success: function (res) {
        that.setData({
          userInfo: res.data,
          ownerID: res.data.body.ownerID
        })
        console.log('userInfo===', res.data)
        console.log('ownerID====', that.data.ownerID)
      }
    })
  },
  //提交贷款申请
  loanApplication(){
    let req = {
      "action": {
        "serviceCode": "SC000010"
      },
      "body": {
        "openID": OPEN_ID,
        "ownerID": this.data.ownerID,
        "applyNam": this.data.userName,
        "phoneNO": this.data.phoneNum,
        "certTyp": this.data.cardtypeIndex,
        "certNO": this.data.idCNum,
        "applyMoney": this.data.loanAmount,
        "applyDes": this.data.purpose,
        "applyLong": this.data.timeIndex,
        "applyTyp": this.data.loanModeIndex
      }
    }
    const apiUrl = getApp().globalData.host + encodeURI(JSON.stringify(req));
    const that = this
    console.log('req',req)
    wx.request({
      //获取openid接口  
      url: apiUrl,
      data: {},
      header: {
        "content-type": "application/json;charset=UTF-8"
      },
      method: 'POST',
      success: function (res) {
        console.log('贷款申请提交成功')
        console.log('res.data', res.data)
      }
    })
  }
})