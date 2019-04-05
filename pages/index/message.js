// pages/index/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    informationList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      accessToken: options.accessToken
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: '消息列表',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2da0fd',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'information',
      success: function(res) {
        var status = {}
        for(var i in res.data){
          status[res.data[i].id] = 0
        }
        that.setData({
          informationList: res.data,
          status: status
        })
      },
    })
  },
  read:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    var newStatus = this.data.status
    if (e.currentTarget.dataset.type == "text") {
      newStatus[id] = 1
    }
    
    var newInformationList = this.data.informationList
    for (var i in newInformationList){
      if (newInformationList[i].id == id){
        newInformationList[i].hasRead = true
        break
      }
    }
    this.setData({
      status: newStatus,
      informationList: newInformationList
    })
    wx.setStorage({
      key: 'information',
      data: newInformationList
    })
    if (e.currentTarget.dataset.type == "url"){
      wx.navigateTo({
        url: './web?url=' + e.currentTarget.dataset.url + '&accessToken=' + that.data.accessToken,
      })
    }
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
    var that = this
    var lastId = 1
    try {
      const value = wx.getStorageSync('lastId')
      if (value) lastId = value
      wx.request({
        url: getApp().globalData.requestUrl + 'api.php',
        data: {
          accessToken: that.data.accessToken,
          method: "getInformation",
          lastId: lastId
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.informationList.length > 0) {
            const list = wx.getStorageSync('information')
            if (list) {
              wx.setStorage({
                key: 'information',
                data: res.data.informationList.concat(list)
              })
            } else {
              wx.setStorage({
                key: 'information',
                data: res.data.informationList
              })
            }
            wx.setStorage({
              key: 'lastId',
              data: res.data.lastId
            })
          }
        },
        complete:function(){
          wx.stopPullDownRefresh()
        }
      })
    } catch (e) {
      // Do something when catch error
    }
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