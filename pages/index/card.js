// pages/index/card.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    cardNo: "",
    accessToken: null,
    cardInfo:{},
    getingPhone:false,
    mode: 1,
    inputing: ""
  },
  onFoucs: function(e){
    this.setData({
      inputing: e.currentTarget.dataset.item
    })
  },
  unFoucs: function(){
    this.setData({
      inputing: ""
    })
  },
  copy: function (e) {
    wx.setClipboardData({
      data: e.target.dataset.content,
      success(res) {
        wx.showToast({
          title: '已复制到剪贴板',
        })
      }
    })
  },
  cardNoInputHandle(e) {
    this.setData({
      cardNo: e.detail.value
    })
  },
  phoneInputHandle(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      accessToken: options.accessToken
    })
  },

  changeInfo:function(){
    var that = this
    this.setData({
      phone: that.data.cardInfo.phone == "" ? null : that.data.cardInfo.phone,
      cardNo: that.data.cardInfo.cardNo == "" ? null : that.data.cardInfo.cardNo,
      mode: 2
    })
  },
  updateCancel: function(){
    this.setData({
      mode: 1
    })
  },
  updateInfo: function(e){
    var that = this
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        accessToken: that.data.accessToken,
        method: "saveCardInfo",
        cardNo: that.data.cardNo,
        phone: that.data.phone
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status) {
          that.setData({
            needChange: false
          })
          that.getCardInfo()
        } else {
          wx.showModal({
            title: '更新失败',
            content: res.data.reason,
            showCancel: false
          })
        }
      },
      complete: function () {
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2da0fd',
    })
    wx.setNavigationBarTitle({
      title: '我的校园卡',
    })
    this.getCardInfo()
  },
  submitFindedCardInfo: function(e){
    if (e.detail.value.xuehao == "" && e.detail.value.name == "" && e.detail.value.cardNo == ""){
      wx.showModal({
        title: '无法提交',
        content: '卡信息至少需要填一项我们才能找到同学鸭',
        showCancel:false,
        confirmText: "我现在填"
      })
      return
    }
    if (e.detail.value.phone == "" && e.detail.value.wechat == ""){
      wx.showModal({
        title: '无法提交',
        content: '不填写你的联系方式卡主同学找不到你的哦',
        showCancel: false,
        confirmText: "我现在填"
      })
      return
    }
    var that = this
    wx.showLoading({
      title: '正在提交中',
    })
    let { xuehao, name, cardNo, phone,wechat,message,location } = e.detail.value;
    var data = {
      accessToken: that.data.accessToken,
      formId: e.detail.formId,
      xuehao, name, cardNo, phone, wechat, message, location
    }
    wx.request({
      url: getApp().globalData.requestUrl + 'findCard.php',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status) {
          wx.showModal({
            title: '成功提交信息啦',
            content: "很高兴你捡到卡了，我们已经帮你通知卡主了啦",
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '提交信息失败',
            content: res.data.reason,
            showCancel: false
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  changeCardStatus: function(e1){
    console.log(e1)
    var that = this
    if(this.data.cardInfo.cardStatus == 1){
      wx.showModal({
        title: '你确定丢失卡了吗',
        content: '把卡设为丢失状态后如果有同学捡到你的卡，我们会通过微信和短信通知你的哦',
        cancelText: '取消操作',
        confirmText: '确定丢失',
        success: function (e) {
          if (e.confirm) {
            that.setCardStatus(0,e1.detail.formId)
          }
        }
      })
    }else{
      that.setCardStatus(1)
    }
  },

  setCardStatus: function (status, formId = "") {
    var that = this
    wx.showLoading({
      title: '正在设置中',
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        accessToken: that.data.accessToken,
        method: "changeCardStatus",
        status: status,
        formId: formId
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status) {
          wx.showModal({
            title: '设置卡状态成功',
            content: status==1?"恭喜你找回了校园卡":"如果有同学捡到了你的校园卡并填写了消息我们会第一时间通知你的哦，请不要担心",
            showCancel: false
          })
          that.getCardInfo()
        } else {
          wx.showModal({
            title: '设置卡状态失败',
            content: res.data.reason,
            showCancel: false
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  getCardInfo: function(){
    var that = this
    wx.showLoading({
      title: '正在查询中',
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        accessToken: that.data.accessToken,
        method: "getCardInfo"
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status) {
          that.setData({
            cardInfo: res.data.info
          })
        } else {
          wx.showModal({
            title: '获取列表失败',
            content: res.data.reason,
            showCancel: false
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },


  getCard: function () {
    this.setData({
      mode: 3
    })
  },
  info:function(){
    this.setData({
      mode: 1
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getCardInfo()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getPhone: function(e){
    var that = this
    this.setData({
      getingPhone: true
    })
    if (e.detail.errMsg != "getPhoneNumber:fail user deny"){
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
        success: function(e){
          if(e.data.status){
            that.setData({
              phone: e.data.phone
            })
          }else{
            wx.showModal({
              title: '自动填写手机号失败',
              content: e.data.reason,
              showCancel: false
            })
          }
        },
        complete: function(){
          that.setData({
            getingPhone: false
          })
        }
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '口袋北理-北理珠学生必备校园小程序',
      path: '/pages/index/index2'
    }
  }
})