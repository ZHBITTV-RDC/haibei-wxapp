// pages/index/46.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passwordIsFocus:false,
    idIsFoucs:false,
    kindList:["英语四级","英语六级"],
    kindIndex:0,
    id:"",
    password:"",
    cardList:[],
    accessToken: null
  },
  copy:function(e){
    wx.setClipboardData({
      data: e.target.dataset.content,
      success(res) {
        wx.showToast({
          title: '已复制到剪贴板',
        })
      }
    })
  },
  idInputHandle(e){
    this.setData({
      id: e.detail.value
    })
  },
  passwordInputHandle(e) {
    this.setData({
      password: e.detail.value
    })
  },
  bindKindChange(e) {
    this.setData({
      kindIndex: e.detail.value
    })
  },
  add: function(e){
    var that = this
    if (that.data.id == "" || that.data.password == ""){
      wx.showModal({
        title: '添加失败',
        content: '请不要漏填东西哦✧٩(ˊωˋ*)و✧',
        showCancel: false
      })
      return;
    }
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        accessToken: that.data.accessToken,
        method: "addAdmission",
        kind: that.data.kindList[that.data.kindIndex],
        admissionId: that.data.id,
        password: that.data.password
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status) {
          var item = { kind: that.data.kindList[that.data.kindIndex], admissionId: that.data.id, password: that.data.password}
          var list = that.data.cardList
          list.unshift(item)
          that.setData({
            id: "",
            password: "",
            cardList: list
          })
        } else {
          wx.showModal({
            title: '添加准考证失败',
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
  deleteCard: function(e){
    var that = this
    var id = e.target.dataset.id
    console.log(id)
    wx.showModal({
      title: '确认删除吗',
      content: '您确定要删除这个准考证吗？',
      cancelText: '取消',
      confirmText: '确定删除',
      confirmColor: "#FF0033",
      success(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.requestUrl + 'api.php',
            data: {
              accessToken: that.data.accessToken,
              method: "deleteAdmission",
              id: id
            },
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.showModal({
                title: '删除成功',
                content: '删除准考证成功',
                showCancel: false,
                success:function(){
                  that.checkList()
                }
              })
            },
            complete: function () {
              wx.hideLoading()
            }
          })
        }
      }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2da0fd',
    })
    wx.setNavigationBarTitle({
      title: '英语四六级',
    })
    this.checkList()
  },

  checkList:function(){
    var that = this
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        accessToken: that.data.accessToken,
        method: "admission"
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status) {
          that.setData({
            cardList: res.data.list
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
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }
    })
  },

  score:function(){
    wx.showModal({
      title: '功能开发中...',
      content: '功能正在开发中,请敬请期待',
      showCancel: false
    })
  },
  idOnFoucs: function(){
    this.setData({
      idIsFoucs:true
    })
  },
  idUnFoucs: function(){
    this.setData({
      idIsFoucs: false
    })
  },
  passwordOnFoucs: function () {
    this.setData({
      passwordIsFoucs: true
    })
  },
  passwordUnFoucs: function () {
    this.setData({
      passwordIsFoucs: false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.checkList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})