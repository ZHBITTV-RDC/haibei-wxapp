var app = getApp()
Page({
  data: {
    userInfo: {},
    phone: '',
    getingPhone: false
  },

  getPhone: function (e) {
    var that = this
    this.setData({
      getingPhone: true
    })
    if (e.detail.errMsg != "getPhoneNumber:fail user deny") {
      wx.request({
        url: getApp().globalData.requestUrl + 'getPhone.php',
        data: {
          accessToken: that.data.accessToken,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (e) {
          if (e.data.status) {
            that.setData({
              phone: e.data.phone
            })
          } else {
            wx.showModal({
              title: '自动填写手机号失败',
              content: e.data.reason,
              showCancel: false
            })
          }
        },
        complete: function () {
          that.setData({
            getingPhone: false
          })
        }
      })
    }
  },

  formBindsubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    var openid = that.data.openid;
    var msCode = that.data.msCodes; 
    var telCode = e.detail.value.telCode;
    var mobile = that.data.mobile;
    if (mobile == '1234567890'){
      wx.showToast({
        title: '请填手机号',
        icon: 'loading',
        duration: 1000
      })
    }else{
      if (msCode == telCode) {
        wx.request({
          url: API_URL + 'userChick' + '/openid/' + openid,
          data: formData,
          header: {
            'Content-Type': 'application/json'
          },
          success: function (e) {
            wx.showToast({
              title: '验证通过',
              icon: 'loading',
              duration: 1000
            })
            setTimeout(function () {
              wx.switchTab({
                url: '../add/add',
              })
            }, 1200)
          }
        })
      } else {
        wx.showToast({
          title: '验证码错误',
          icon: 'loading',
          duration: 1000
        })
      }
    }
  },

  onLoad: function (options) {
    var that = this

  },

  onShow: function () {
    var that = this
    app.userInfoReadyCallback = res => {
      that.setData({
        userInfo: res.userInfo,
      })
    }
  }
})