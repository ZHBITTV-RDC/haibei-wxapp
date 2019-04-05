// pages/index/score.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreList: [],
    semesterList: [
      { id: "2018-2019-2", name: "2018-2019学年第二学期" }, 
      { id: "2018-2019-1", name: "2018-2019学年第一学期" },
      { id: "2017-2018-2", name: "2017-2018学年第二学期" },
      { id: "2017-2018-1", name: "2017-2018学年第一学期" },
      { id: "2016-2017-2", name: "2016-2017学年第二学期" },
      { id: "2016-2017-1", name: "2016-2017学年第一学期" },
      { id: "2015-2016-2", name: "2015-2016学年第二学期" },
      { id: "2015-2016-1", name: "2015-2016学年第一学期" },
      { id: "2014-2015-2", name: "2014-2015学年第二学期" },
      { id: "2014-2015-1", name: "2014-2015学年第一学期" },
      { id: "2013-2014-2", name: "2013-2014学年第二学期" },
      { id: "2013-2014-1", name: "2013-2014学年第一学期" },
      { id: "2012-2013-2", name: "2012-2013学年第二学期" },
      { id: "2012-2013-1", name: "2012-2013学年第一学期" },
      { id: "2011-2012-2", name: "2011-2012学年第二学期" },
      { id: "2011-2012-1", name: "2011-2012学年第一学期" },
    ],
    index: 1,
    credit: 0,
    accessToken: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '课程成绩',
    })
    this.setData({
      accessToken: options.accessToken
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2da0fd',
    })
    this.checkScore()
  },

  checkScore: function (semester = null){
    var that = this
    wx.showLoading({
      title: '正在查询中',
    })
    if (semester == null){
      var data = { method: 'grade', accessToken: that.data.accessToken }
    }else{
      var data = { method: 'grade', accessToken: that.data.accessToken, semester: semester }
    }
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            scoreList: res.data.scoreData,
            credit: res.data.credit
          })
        } else {
          wx.showModal({
            title: '查询成绩失败',
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

  changeSemester: function(e){
    this.setData({
      index: e.detail.value
    })
    this.checkScore(this.data.semesterList[e.detail.value].id)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.checkScore(this.data.semesterList[this.data.index].id)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})