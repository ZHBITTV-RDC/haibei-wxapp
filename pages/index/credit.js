// pages/index/credit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getCredit: function () {
    var that = this
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        accessToken: that.data.accessToken,
        method: "getCredit"
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var creditDetail = res.data.creditDetail
          var sum = {
            "通识必修课": 0,
            "通识选修课": 0,
            "学科基础课": 0,
            "专业必修课": 0,
            "专业选修课": 0,
            "跨领域选修课": 0,
            "素质拓展课": 0
          }
          for (var i in creditDetail) {
            if (creditDetail[i][8] == "√") {
              sum[creditDetail[i][6]] = sum[creditDetail[i][6]] + parseInt(creditDetail[i][4])
            }
          }
          console.log(sum)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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