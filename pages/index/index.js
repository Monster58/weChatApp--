//index.js
//获取应用实例
const app = getApp()
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  
var villages = []
var villageIndex = 0
var isAgree = 1
var villageId  =0
Page({
  data: {
    motto: 'ccccc',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    no:'',
    villages:[],
    villageIndex:0,
    isAgree:1,
    villageId:0,
    scene:'',
    b:'',
    u:'',
    r:'',
    myroles: ["业主", "租户", "家属"],
    myroleIndex: 0,
    openId:'',
  },

  //选择小区
  bindPickerChange_hx: function (e) {
    var that = this;
    that.setData({   //给变量赋值
      villageIndex: e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致    
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      scene: decodeURIComponent(options.scene)
    })
   
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.getOpenId();
    this.getVillageList();

    
  
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //用于处理扫描二维码的情况，仅自动选择小区
   
    if (this.data.scene) {
      var scene = decodeURIComponent(this.data.scene)
      if (scene && scene != 'undefined') {
        var sceneArray = scene.split(",");
        var vid = 0;
        var roomCode ='';
        if (sceneArray) {
          vid = sceneArray[1];
          this.setData({
            villageId: vid,
          })
          var arr = this.data.villages;
         
          for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i].id == vid) {
              this.setData({
                villageIndex: i,
              })
              wx.setStorage({
                key: "villageId",
                data: arr[i].id
              })
              wx.setStorage({
                key: "villageName",
                data: arr[i].name
              })
              console.log("villageIndex" + villageIndex)
            }
          }
          roomCode = sceneArray[0];
          if(roomCode){
            var codeArray = roomCode.split("-");
           
            this.setData({
              no: roomCode,
              b: codeArray[0],
              u: codeArray[1],
              r: codeArray[2],
            })
           // console.log("r:" + this.data.r)
           // this.searchMyCr(this.data.villageId,this.data.no);
          }
        }

      }
    }
  },
  getUserInfo: function(e) {
    
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getOpenId: function (e) {
    var apiUrl = getApp().globalData.host + "/miniProgramApi/get-wx-session.do"; 
    var that = this;
    wx.login({

      success: function (res) {

        wx.request({
          //获取openid接口  
          url: apiUrl,
          data: {
            js_code: res.code,
            grant_type: 'authorization_code'
          },

          method: 'GET',
          success: function (res) {
            console.log(res)
            OPEN_ID = res.data.openid;//获取到的openid  
            SESSION_KEY = res.data.session_key;//获取到session_key  
            console.log("OPEN_ID:"+OPEN_ID)

            wx.setStorage({
              key: "OPEN_ID",
              data: res.data.openid
            })
            that.setData({
              openId: res.data.openid,
            })
            
          }
        })
      }
    })
  },
  getVillageList: function (e){
    var that = this;
    var apiUrl = getApp().globalData.host + "/miniProgramApi/get-village-list.do"; 
    wx.request({
      url: apiUrl,
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data) {
          villages = res.data;
        }
        that.setData({
          villages: res.data,
        })
      }
    })
  },

  bindAgreeChange:function(e)
{
    if (e.detail.value == '') {
      isAgree = 0
    }
    else {
      isAgree = 1
    }
   
},
  bindMyroleChange: function (e) {
    this.setData({
      myroleIndex: e.detail.value
    })
  },
  getMyInfo:function(e){
    var that = this;
    var mobile = e.detail.value.mymobile;
    var roomNo = e.detail.value.b + "-" + e.detail.value.u + "-" + e.detail.value.r;
    if (mobile == '') {
      
      that.setData({
        showTopTips: "error",
        errMsg: "手机号不能为空"
      })
      return false
    }
    else if (mobile.length != 11) {
      that.setData({
        showTopTips: "error",
        errMsg: "手机号长度有误！"
      })
      return false;
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      that.setData({
        showTopTips: "error",
        errMsg: "手机号有误！"
      })
      return false;
    }
    this.searchMyCr(this.data.villages[this.data.villageIndex].id, roomNo, this.data.openId, this.data.myroleIndex, e.detail.value.mymobile);
  },
//查询欠费记录
  searchMyCr: function (villageId,roomCode,openId,myrole,mobile) {
    var that = this;
    var apiUrl = getApp().globalData.host + "/miniProgramApi/get-usr-charge-idv2.do"; 
    var vId = villageId;
    wx.setStorage({
      key: "villageId",
      data: vId
    })
    wx.request({
      url: apiUrl,
      data: {
        openId: openId,
        role: myrole,
        mobile:mobile,
        no: roomCode,
        villageId: vId

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data){
          wx.navigateTo({
            url: '/pages/order/order?villageId=' + vId + '&roomCode=' + roomCode
          })
        }else{
          that.setData({
            showTopTips:"error",
            errMsg:"未找到欠费记录"
          })
        }
        
      }
    })
   
  }
})
