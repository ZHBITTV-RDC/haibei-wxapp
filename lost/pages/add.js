var bmap = require('../utils/bmap-wx.js');
var wxMarkerData = [];  
Page({
  data: {
    ak:"DmdxVkWUdvqT85CqoDfFwIDylmwU0agA", 
    markers: [],    
    longitude:'',    
    latitude:'',    
    address:'获取中...',    
    imglist: [],
    item: '../../image/upic.png',
    loading: false,
    disabled: false,
    loadingHide: true,
    loadingText: "位置获取中",
    content:'',
    kind: ["校园卡/学生证 ","身份证","其他物品"],
    index: 0,
    type: 1,
    photo: ''
  },
  changeType: function(e){
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindKindChange: function(e){
    this.setData({
      index:e.detail.value
    })
  },
  diushi:function(){
    this.setData({
      isChecksd: false,
      isChecked: true,
      labels:"丢失日期"
    })
  },

  jiandao: function () {
    this.setData({
      isChecked: false,
      isChecksd: true,
      labels: "捡到日期"
    })
  },
  formSubmit: function (detail,photo){
    var that = this;
    detail['accessToken'] = that.data.accessToken
    detail['method'] = 'addLostItem'
    detail['headimgurl'] = that.data.userInfo.avatarUrl
    detail['nickname'] = that.data.userInfo.nickName
    detail['photo'] = photo
    wx.showLoading({
      title: '提交中',
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: detail,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        if(res.data.status==1){
          wx.showModal({
            title: '提交成功',
            content: '如果物品主人有使用小程序我们将会发送通知给对方的哦',
            showCancel: false,
            success: function(){
              wx.navigateBack()
            }
          })
        }else{
          wx.showModal({
            title: '提交失败',
            content: res.data.reason,
            showCancel: false
          })
        }
      },
      complete: function(){
        wx.hideLoading()
      }
    })
  },
  checkInfo: function (e) {
    console.log(e)
    var detail = e.detail.value
    var self = this
    if (detail.wechat == "" && detail.phone == ""){
      wx.showModal({
        title: '提交失败',
        content: '你的联系信息需要填写一项哦',
        showCancel: false
      })
      return
    }
    if (detail.kind == 0 && detail.studentId == "" && detail.studentName == "" && detail.cardNo == ""){
      wx.showModal({
        title: '提交失败',
        content: '学号/银行卡号/姓名至少需要填一项哦，不然我们联系不了同学哦',
        showCancel: false
      })
      return
    }
    if (detail.kind == 1 && detail.idcardNo == "" && detail.studentName == "") {
      wx.showModal({
        title: '提交失败',
        content: '身份证/姓名至少需要填一项哦，不然我们联系不了同学哦',
        showCancel: false
      })
      return
    }
    if (detail.title == "") {
      wx.showModal({
        title: '提交失败',
        content: '标题不能为空哦',
        showCancel: false
      })
      return
    }
    if(self.data.imglist.length>0){
      wx.showLoading({
        title: '上传文件中',
      })
      wx.cloud.uploadFile({
        cloudPath: self.filenameHandle(self.data.imglist[0]), // 上传至云端的路径
        filePath: self.data.imglist[0], // 小程序临时文件路径
        success: res => {
          self.formSubmit(e.detail.value, res.fileID)
        },
        fail: res => {
          wx.showModal({
            title: '上传图片失败',
            content: '上传图片失败，请尝试重新上传',
            showCancel: false
          })
        },
        complete: res => {
          wx.hideLoading()()
        }
      })
    }else{
      self.formSubmit(e.detail.value, '')
    }
  }, 

  upsUid: function(e){
    var openid = e.data;
    wx.request({
      url: API_URL + 'seachUser/openid/' + openid,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data != 0){
          wx.navigateTo({
            url: '../mobile/mobile',
          })
        }
      }
    })
  },

  onLoad:function(e){
    this.getBaiduMap();
    this.setData({
      accessToken: e.accessToken
    })
    wx.cloud.init({
      traceUser: true
    })
  },

  onShow: function(){
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          userInfo: userInfo
        })
      },
      fail: function (res){
        wx.showModal({
          title: '无法获取用户信息',
          content: '无法获取用户信息，请先允许小程序获取用户信息哦',
          showCancel: false
        })
      }
    })
    that.setData({
      disabled: false,
      loading: false,
      content:''
    })
  },
  //取出图片最后的名字 如x.jpg
  filenameHandle: function (path) {
    var path = path.split("//")
    path = path[1].split(".")
    return path[path.length - 2] + "." + path[path.length-1]
  },

  checkimg: function () {
    self = this
    wx.chooseImage({
      count: 1, 
      sizeType: ['compressed'], 
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        self.setData({
          imglist: tempFilePaths
        })
      }
    })
  },

  getLocation: function (){
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
      }
    })
  },
  clearGps: function(){
    this.getBaiduMap();
  },
  getBaiduMap: function (){     
    var that = this;    
    that.setData({ loadingHide: false });
    var BMap = new bmap.BMapWX({     
        ak: that.data.ak     
    });    
    var fail = function(data) { 
        var errMsg = data.errMsg;
        if(errMsg == 'getLocation:fail auth deny'){
          that.setData({  
            latitude: 0,    
            longitude: 0,
            address:'火星网友一枚'
          })
        }else{
          that.setData({
            latitude: 0,    
            longitude: 0,
            address:'火星网友一枚'
          })
        }
        setTimeout(function () {
          that.setData({ loadingHide: true });
        }, 1000)  
    };     
    var success = function(data) {  
        wxMarkerData = data.wxMarkerData;
        that.setData({     
            markers: wxMarkerData,    
            latitude: wxMarkerData[0].latitude,    
            longitude: wxMarkerData[0].longitude,    
            address: wxMarkerData[0].address,    
        }); 
        setTimeout(function () {
          that.setData({ loadingHide: true });
        }, 1000)     
    }; 
    BMap.regeocoding({     
        fail: fail,     
        success: success
    }); 
  }

})