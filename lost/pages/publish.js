// lost/pages/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accessToken: '',
  },
  getList: function () {
    var _this = this
    wx.showLoading({
      title: '获取信息中',
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        method: 'getMyLostList',
        accessToken: _this.data.accessToken
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        for (var i in list) {
          list[i].datetime = _this.timeHandle(list[i].datetime)
        }
        _this.setData({
          list: list,
          id: list[list.length - 1].id
        })
      },
      complete: function () {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        _this.setData({
          noMore: true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
    this.setData({
      accessToken: options.accessToken
    })
  },
  timeHandle: function (time) {  //时间处理
    var today = new Date()
    var y = today.getFullYear();
    var m = today.getMonth() + 1;//获取当前月份的日期 
    var d = today.getDate();
    if (m < 10) {
      m = '0' + m;
    };
    if (d < 10) {
      d = '0' + d;
    }
    var todayStr = y + "-" + m + "-" + d
    var originStr = time.substring(0, 10)
    var day1 = new Date(todayStr)
    var day2 = new Date(originStr)
    var result = (day1 - day2) / 86400000
    if (result == 0) {
      return time.substring(11, 16)
    } else if (result == 1) {
      return "昨天"
    } else if (result == 2) {
      return "前天"
    } else if (result <= 15) {
      return result + "天前"
    } else {
      return time.substring(5, 10)
    }
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
    this.getList()
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