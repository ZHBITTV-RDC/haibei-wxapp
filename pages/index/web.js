// pages/index/web.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url: options.url + '?accessToken=' + options.accessToken
    })
  },
  onShareAppMessage: function () {
    return {
      title: '口袋北理-北理珠学生必备校园小程序',
      path: '/pages/index/index2'
    }
  }
})