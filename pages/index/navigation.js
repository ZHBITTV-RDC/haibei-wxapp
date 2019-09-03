// pages/index/navigation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDetail: true,
    currentIndex: 0,
    navi: null,
    mapData: {
      latitude: 22.364324,
      longitude: 113.543487
    },
    rollTo: null, //点击地图标记时列表跳转到该项
    satellite: false
  },
  showSatellite: function(){
    this.setData({
      satellite: !this.data.satellite
    })
  },
  showMarker: function(e){
    this.setData({
      rollTo: e.markerId //赋值
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '正在加载中',
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'navigation.json',
      success: function (res) {
        if (res.statusCode == 200){
          var data = res.data
          for (var i in data){
            for (var j in data[i].list){
              data[i].list[j].id="location"+j
            }
          }
          that.setData({
            navi: data
          })
          wx.setStorage({
            key: 'navigation',
            data: data,
          })
          that.changeKind()
        }else{
          that.loadFail()
        }
      },
      fail: function(){
        that.loadFail()
      },
      complete: function(){
        wx.hideLoading()
      }
    })
  },

  loadFail: function (){
    var that = this
    wx.getStorage({
      key: 'navigation',
      success: function(res) {
        that.setData({
          navi: res.data
        })
      },
    })
  },

  showLocation: function(e){
    var mapData = {
      latitude: e.currentTarget.dataset.latitude,
      longitude: e.currentTarget.dataset.longitude
    }
    this.setData({
      mapData: mapData
    })
  },

  showhide: function(e){  
    this.setData({
      showDetail: !this.data.showDetail
    })
  },

  changeKind: function(e) {
    var marker = []
    var currentIndex = e ? e.currentTarget.dataset.index : 0
    if (currentIndex == 0) {
      for (var i in this.data.navi[currentIndex].list) {
        for (var j in this.data.navi[currentIndex].list[i].detail) {
          marker.push(this.data.navi[currentIndex].list[i].detail[j])
        }
      }
    }
    this.setData({
      currentIndex: currentIndex,
      marker: marker
    })
  },

  showNavigation: function(e){
    wx.openLocation({
      latitude: parseFloat(e.currentTarget.dataset.latitude),
      longitude: parseFloat(e.currentTarget.dataset.longitude),
      name: e.currentTarget.dataset.title,
      address: "北京理工大学珠海学院-" + e.currentTarget.dataset.title
    })
    // wx.navigateTo({
    //   url: 'naviTencent?longitude=' + e.currentTarget.dataset.longitude + "&latitude=" + e.currentTarget.dataset.latitude + "&title=" + e.currentTarget.dataset.title
    // })
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
    return {
      title: '北理珠校内导航-再也不怕在校园迷路',
      path: '/pages/index/index2'
    }
  }
})