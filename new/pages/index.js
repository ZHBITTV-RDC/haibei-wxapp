// new/newStudent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.wave = this.selectComponent("#wave");
    this.setData({
      accessToken: options.accessToken
    })
  },
  check: function (e) {
    var _this = this
    wx.request({
      url: getApp().globalData.requestUrl + 'newStudent.php',
      data: {
        accessToken: _this.data.accessToken,
        studentId: _this.data.ksh,
        method: 'bind'
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        if(res.data.status==1){
          wx.showModal({
            title: '恭喜你被北理珠录取！！！',
            content: '恭喜你，你已被北理珠的\r\n' + res.data.college + ' ' + res.data.major + '专业\r\n录取，同时你已绑定口袋北理\r\n随时可以查询录取相关信息\r\n入学以后即可使用教务账号绑定口袋北理小程序\r\n愿你的大学生活更多精彩',
            showCancel: false,
            success: function(){
              wx.navigateBack()
            }
          })
        }else{
          wx.showModal({
            title: '查询失败',
            content: res.data.reason,
            showCancel: false
          })
        }
      }
    })
  },
  ksh: function (e) {
    this.setData({
      ksh: e.detail.value
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '口袋北理-北理珠学生必备校园小程序',
      path: '/pages/index/index2'
    }
  }
})