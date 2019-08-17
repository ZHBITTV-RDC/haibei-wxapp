var app = getApp();
var util = require("../utils/util.js");
var network = require('../utils/network.js');
Page({
  data: {
    accessToken: '',
    showShare: false
  },

  onShow: function (e) {

  },
  closeBtn: function(){
    this.setData({
      showShare: false
    })
  },
  showBtn: function(){
    this.setData({
      showShare: true
    })
  },

  downloadQrcode: function(){
    wx.showLoading({
      title: '生成海报中',
    })
    var that = this
    wx.downloadFile({
      url: getApp().globalData.requestUrl + "getQrcode.php?f=1&id=" + that.data.detail.id,
      success: function (res) {
        if(that.data.detail.photo){
          that.downloadPhoto(res.tempFilePath)
        }else{
          that.savePoster(res.tempFilePath,"")
        }
      },
      fail: function(){
        wx.hideLoading()
      }
    })
  },
  downloadPhoto: function (qrcodePath) {
    var that = this
    wx.cloud.getTempFileURL({
      fileList: [that.data.detail.photo],
      success: res => {
        wx.downloadFile({
          url: res.fileList[0].tempFileURL,
          success: function (res) {
            that.savePoster(qrcodePath, res.tempFilePath)
          },
          fail: function () {
            wx.hideLoading()
          }
        })
      },
      fail: res => {
        wx.hideLoading()
      }
    })
  },

  savePoster: function(qrcodePath, photoPath){
    var that = this
    var context = wx.createCanvasContext('poster', this)
    var h = 0
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, that.data.width * 0.95, that.data.posterHeight);
    if (that.data.detail.photo) {
      context.drawImage(photoPath, 30, 20, (that.data.width * 0.95) - 60, (that.data.width * 0.95) - 60)
      h = h + 20 + (that.data.width * 0.95) - 30
    } else {
      h = 30
    }
    // 设置字体
    context.font = "24px bolder"
    context.fillStyle = "#3c3c3c"
    // 绘制文字（参数：要写的字，x坐标，y坐标）
    if (that.getLength(that.data.detail.title) > 26) {
      context.fillText(that.data.detail.title.substring(0, 13), 30, h)
      h = h + 30
      context.fillText(that.data.detail.title.substring(13, 26), 30, h)
    } else {
      context.fillText(that.data.detail.title, 30, h)
    }
    if (that.data.detail.content) {
      h = h + 30
      context.font = "18px bolder"
      context.fillText(that.data.detail.content, 30, h)
    }
    h = h + 30
    context.font = "18px bolder"
    context.fillText("失主请联系:" + (that.data.detail.phone ? that.data.detail.phone : that.data.detail.wechat), 30, h)
    context.font = "12px bolder"
    context.fillStyle = "#9d9d9d"
    h = h + 20
    context.fillText(that.data.detail.nickname + " " + that.data.detail.datetime.substring(0, 10) + "发布", 30, h)
    context.beginPath()
    context.setLineWidth(1)
    h = h + 20
    context.moveTo(30, h)
    context.lineTo((that.data.width * 0.95) - 30, h)
    context.stroke()
    h = h + 5
    context.drawImage(qrcodePath,30, h, 80, 80)
    context.font = "12px bolder"
    context.fillText("长按识别查看失物详情", 120, h + 25)
    context.fillText("长按识别小程序发布或搜索失物信息", 120, h + 45)
    context.fillText("口袋北理-北理珠学子学习生活小助手", 120, h + 65)
    context.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId: 'poster',
        success(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(){
              wx.showModal({
                title: '保存成功',
                content: '分享海报已经保存到你的手机相册，赶快去分享吧',
                showCancel: false,
                confirmText: '我知道了',
                complete: function(){
                  that.setData({
                    showShare: false
                  })
                }
              })
            }
          })
          
        },
        fail(res) {
          wx.showModal({
            title: '生成海报失败',
            content: '发生未知错误，请重新尝试',
          })
        },
        complete(res){
          wx.hideLoading()
        }
      })
    })
  },

  onLoad: function (params) {
    var that = this;
    this.setData({
      accessToken: params.accessToken
    })
    wx.cloud.init()
    wx.showLoading({
      title: '加载中',
    }) 
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        id: params.id,
        method: 'getLostDetail',
        accessToken: that.data.accessToken
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var mobile = res.data.detail.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        var detail = res.data.detail
        detail.publishTime = res.data.detail.datetime.substring(5, 16)
        detail.mobile = mobile
        that.setData({
          detail: detail
        })
        // 计算海报高度
        var h=0
        if (detail.photo) {
          h = h + 20 + (that.data.width * 0.95) - 30
        }else{
          h = 30
        }
        if (that.getLength(detail.title) > 26) {
          h = h + 30
        }
        if (detail.content) {
          h = h + 30
        }
        h = h + 175
        that.setData({
          posterHeight: h
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
    
    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
      success: function (res) {
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight
        })
      }
    })


  },
  getLength:function (str){
    var intLength = 0 
    for (var i = 0; i < str.length;i++){
      if ((str.charCodeAt(i) < 0) || (str.charCodeAt(i) > 255)){
        intLength = intLength + 2
      }else{
        intLength = intLength + 1
      }
    }
    return intLength 
  },
  callmeTap: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.detail.phone
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var urlink = new Array(current);
    wx.previewImage({
      current: 'current', 
      urls: urlink  
    })
  },
  copyWechat: function(e){
    var that = this
    wx.setClipboardData({
      data: that.data.detail.wechat
    })
  },
  openMaps:function(e){
    var lat = e.currentTarget.dataset.lat;
    var long = e.currentTarget.dataset.long;
    var address = e.currentTarget.dataset.address;
    wx.openLocation({
      latitude: Number(lat),
      longitude: Number(long),
      scale: 28,
      name:'信息发出位置',
      address: address
    })
  },



  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '【丢失】请各位朋友帮我找一找',
      path: '/pages/index/index2?scene=lost.' + that.data.detail.id
    }
  }

})