// pages/index/exam.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    examList:[],
    accessToken: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2da0fd',
    })
    wx.setNavigationBarTitle({
      title: '考试安排',
    })
    this.setData({
      accessToken: options.accessToken
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getExamInfo()
  },

  getExamInfo: function(){
    var that = this
    wx.showLoading({
      title: '正在查询中',
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        method: 'exam',
        accessToken: that.data.accessToken
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            examList: res.data.examList,
          })
        } else {
          wx.showModal({
            title: '查询考试安排失败',
            content: res.data.reason,
            showCancel: false
          })
        }
      },
      complete: res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})