var app = getApp();
var util = require("../utils/util.js");
var network = require('../utils/network.js');
Page({
  data: {
    openid:'',
    windowWidth:'',
    windowHeight:'',
    contents:'',
    vid:'',
    tel:'0123456789',
    mobile:'',
    isShow: false,
    isLoad: true,
    content: "",
    isLoading: true,
    comments: [],
    accessToken: 'LhPrBenSowVemGsHbuihKCPFmyLaptk29MIReGmBAeDfxaEA4hUUdIXfH1LwlRPx',
    view_id: 0,
    userInfo: {},
    nsdata: true,
    page: 1,
    pageSize: 5,
    gzList:[]  
  },

  onShow: function (e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth * 0.92
        })
      }
    })
  },


  getGuanzhu:function(ev){
    var that = this;
    var userInfo = that.data.userInfo;
   if(ev == 1){
      wx.request({
        url: API_URL + 'getGuanzhu/',
        data: {
          cid: 1,
          openid: that.data.openid,
          vid: that.data.vid,
          avatar: userInfo.avatarUrl,
          uname: userInfo.nickName
        },
        method: 'GET',
        success: function (res) {

        }
      })
   }else if(ev == 2){
       wx.request({
        url: API_URL + 'getGuanzhu/',
        data: {
          cid: 2,
          vid: that.data.vid
        },
        method: 'GET',
        success: function (res) {
          that.setData({
            gzList: res.data
          })
        }
      })
   }

  },

  onLoad: function (params) {
    var that = this;
    wx.showNavigationBarLoading(); 
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
        var mobile = res.data.detail.tel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        that.setData({
          content: res.data.detail.content,
          vid: res.data.detail.id,
          tel: res.data.detail.tel,
          mobile:mobile,
          headimgurl: res.data.detail.headimgurl,
          nickname: res.data.detail.nickname,
          datetime: res.data.detail.datetime,
          photo: res.data.detail.photo
          //view_id: params.id,
          //gzList: res.data.gzlist
        })
        wx.showLoading({
          title: '加载中'
        })
      },
      complete: function () {
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        wx.hideNavigationBarLoading() 
      }
    })
    wx.login({
      success: function (loginCode) {
        wx.request({
          url: API_URL + '/GetOpenid/code/' + loginCode.code,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({
              openid: res.data
            })
          }
        })
      }
    })

    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    setTimeout(function () {
      that.getGuanzhu(1);
    }, 5000) 
    setTimeout(function () {
      that.getGuanzhu(2);
    }, 7000)
  },

  callmeTap: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.tel
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


  onPullDownRefresh: function () {
    this.data.page = 1
    this.getMusicInfo('刷新数据')
  },



  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '【丢失】请各位朋友帮我找一找',
      path: '/pages/view/view?id=' + that.data.vid
    }
  }

})