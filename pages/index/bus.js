// pages/index/bus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    huafaToBeili: [{ hour: "11", minute: "00" }, { hour: "14", minute: "00" }, { hour: "16", minute: "00" }, { hour: "17", minute: "00" }, { hour: "19", minute: "30" }, { hour: "21", minute: "00" }],
    beiliToHuafa: [{ hour: "11", minute: "00" }, { hour: "12", minute: "00" }, { hour: "15", minute: "00" }, { hour: "17", minute: "00" }, { hour: "18", minute: "00" }],
    beiliToWoermaWorkday: [{ hour: "09", minute: "00" }, { hour: "11", minute: "40" }, { hour: "14", minute: "00" }, { hour: "15", minute: "00" }, { hour: "16", minute: "30" }, { hour: "19", minute: "00" }],
    beiliToWoermaWorkend: [{ hour: "09", minute: "00" }, { hour: "10", minute: "30" }, { hour: "11", minute: "40" }, { hour: "14", minute: "00" }, { hour: "15", minute: "30" }, { hour: "17", minute: "00" }, { hour: "19", minute: "00" }],
    woermaToBeiliWorkend: [{ hour: "08", minute: "00" }, { hour: "10", minute: "00" }, { hour: "11", minute: "00" }, { hour: "13", minute: "30" }, { hour: "14", minute: "30" }, { hour: "16", minute: "30" }, { hour: "18", minute: "30" }],
    woermaToBeiliWorkday: [{ hour: "08", minute: "00" }, { hour: "11", minute: "00" }, { hour: "13", minute: "30" }, { hour: "14", minute: "30" }, { hour: "16", minute: "00" }, { hour: "18", minute: "00" }],
    nowHour: new Date().getHours(),
    nowMinute: new Date().getMinutes(),
    isShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  checkLocation: function(e){
    wx.openLocation({
      latitude: 22.3595121279,
      longitude: 113.5473382473,
      scale: 16,
      name: "北理工免费巴士上车点",
      address: "北理珠教师公寓12栋/创业学院附近"
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    var t = setInterval(function(){
      that.setData({
        nowHour: new Date().getHours(),
        nowMinute: new Date().getMinutes(),
      })
    },1000)
    wx.setNavigationBarTitle({
      title: '华发&沃尔玛',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2da0fd',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  change: function(){
    this.setData({
      isShow: !this.data.isShow
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})