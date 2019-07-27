// pages/index/naviTencent.js
let plugin = requirePlugin("myPlugin")
let routeInfo = {
  endLat: 22.364324,    // 终点纬度必传
  endLng: 113.544517,  //终点经度 必传
  endName: "北京理工大学珠海学院",  //终点名称 必传
  mode: "walk"  //算路方式 选填
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    routeInfo: routeInfo,
    routeData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      routeData: options
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
    this.setData({
      routeInfo: {
        endLat: this.data.routeData.latitude,    // 终点纬度必传
        endLng: this.data.routeData.longitude,  //终点经度 必传
        endName: this.data.routeData.title,  //终点名称 必传
        mode: "walk"  //算路方式 选填
      }
    })
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