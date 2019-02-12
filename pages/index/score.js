// pages/index/score.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreList: [
      { courseName: "离散数学", courseResult: "66", courseCredit: "3", courseType: "学科基础课" }, 
      { courseName: "离散数学", courseResult: "66", courseCredit: "3", courseType: "学科基础课" },
      { courseName: "离散数学", courseResult: "66", courseCredit: "3", courseType: "学科基础课" },
      { courseName: "离散数学", courseResult: "49", courseCredit: "3", courseType: "学科基础课" },
      { courseName: "离散数学", courseResult: "良好", courseCredit: "3", courseType: "学科基础课" },
      { courseName: "离散数学", courseResult: "66", courseCredit: "3", courseType: "学科基础课" },
      { courseName: "离散数学", courseResult: "66", courseCredit: "3", courseType: "学科基础课" },
      { courseName: "离散数学", courseResult: "66", courseCredit: "3", courseType: "学科基础课" },
      { courseName: "离散数学", courseResult: "66", courseCredit: "3", courseType: "学科基础课" },
      ],
    semesterList: [
      { id: "2018-2019-2", name: "2018-2019学年第二学期" }, 
      { id: "2018-2019-1", name: "2018-2019学年第一学期" }],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '课程成绩',
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
    console.log("刷新")
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