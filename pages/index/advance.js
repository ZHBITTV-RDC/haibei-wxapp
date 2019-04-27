// pages/index/advance.js
const qiniuUploader = require("../../utils/qiniuUploader");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    btn:'选择文件'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      accessToken: options.accessToken
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        method: 'getToken',
        accessToken: this.data.accessToken
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            token: res.data.token
          })
          that.initQiniu(res.data.token)
        }
      }
    })
  },
  initQiniu: function (upToken) {
    var options = {
      region: 'SCN',
      domain: 'http://haibei.cdn.yuyisoft.net',
      uptoken: upToken,
      shouldUseQiniuFileName: true
    }
    qiniuUploader.init(options);
  },
  chooseFileHandle: function () {
    var that = this
    wx.chooseImage({
      sizeType: "compressed",
      count: 1,
      success: function(res) {
        that.uploadFile(res.tempFilePaths[0])
      },
    })
  },
  formSubmit: function (res){
    if(res.detail.value.content == ""){
      wx.showModal({
        title: '出错',
        content: '反馈内容不能为空哦',
        showCancel: false
      })
    }else{
      wx.request({
        url: getApp().globalData.requestUrl + 'api.php',
        data: {
          method: 'advance',
          accessToken: this.data.accessToken,
          content: res.detail.value.content,
          mobile: res.detail.value.mobile,
          fileUrl: res.detail.value.fileUrl,
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.status == 1) {
            wx.showModal({
              title: '成功',
              content: '感谢你的支持，我们看到之后会反馈结果给你的哦',
              showCancel: false,
              complete: function(){
                wx.navigateBack()
              }
            })
          }
        }
      })
    }
    console.log(res)
  },
  uploadFile: function (path){
    var that = this
    qiniuUploader.upload(path, (res) => {
      that.setData({
        'imageURL': res.imageURL
      });
    }, (error) => {
      that.setData({
        btn: '上传出错，请重新上传'
      });
    }, null, (res) => {
      that.setData({
        btn: '上传中(' + res.progress + '%)'
      })
      },null, null, (err) => {
        that.setData({
          btn: '文件已上传'
        })
      });
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