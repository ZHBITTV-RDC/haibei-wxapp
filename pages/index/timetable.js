// pages/index/timetable.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    courseList:[
      [{ courseName: "高等数学", courseLocation: "MD305" },
        { courseName: "高等数学", courseLocation: "MD304" },
        { courseName: "", courseLocation: "" },
        { courseName: "", courseLocation: "" },
        { courseName: "高等数学", courseLocation: "MD303" },
        { courseName: "高等数学", courseLocation: "MD302" },
        { courseName: "高等数学", courseLocation: "MD301" },
      ]
    ]
  },
  showButton: function () {
    var that = this;
    that.setData({
      isShow: (!that.data.isShow)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      title: '课程表',
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