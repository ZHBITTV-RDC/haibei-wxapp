Page({
  data: {
    hasPass: 0,
    lectureList: [],
    accessToken: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '讲座信息',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2da0fd',
    })
    this.setData({
      accessToken: options.accessToken
    })
  },

  checkLecture: function(){
    var that = this
    wx.showLoading({
      title: '正在查询中',
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: { 
        method: 'lecture',
        accessToken: that.data.accessToken 
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            lectureList: res.data.lectureData,
            hasPass: res.data.pass
          })
        } else {
          wx.showModal({
            title: '查询讲座失败',
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.checkLecture()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.checkLecture()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '口袋北理-北理珠学生必备校园小程序',
      path: '/pages/index/index2'
    }
  }
})