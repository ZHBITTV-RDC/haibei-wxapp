// pages/index/timetable.js
var app1 = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    courseList:[],
    semester: app1.globalData.semesterList,
    semesterIndex: 0,
    weekIndex: 0,
    weekList: [],
    hasChange: false,
    isShowDetail: false,
    detail:{
      courseName: null,
      courseLocation: null,
      teacherName: null,
      courseTime: null,
      courseTimeDetail: null,
    }
  },
  changeSemester:function(e){
    this.setData({
      hasChange:true,
      semesterIndex: e.detail.value
    })
    this.getTimetable()
  },
  changeWeek: function (e) {
    var that = this
    this.setData({
      hasChange: true,
      weekIndex: e.detail.value
    })
    this.getTimetable()
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
    var weekList = []
    for(var i = 1; i<=19;i++){
      weekList.push({ id: i, value: "第" + i +"周"})
    }
    this.setData({
      accessToken: options.accessToken,
      weekList:weekList
    })
    if (options.weekIndex) {
      this.setData({
        weekIndex: options.weekIndex-1,
        hasChange: true
      })
    }
  },

  getTimetable: function(){
    var that = this
    var data = {}
    if (this.data.hasChange) {
      data = { accessToken: that.data.accessToken, method: "timetable", semester: this.data.semester[this.data.semesterIndex].id, week: this.data.weekList[this.data.weekIndex].id }
    } else {
      data = { accessToken: that.data.accessToken, method: "timetable" }
    }
    wx.showLoading({
      title: '正在查询中',
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status) {
          var dataList = res.data.courseData
          var colorList = []
          var exist = 0
          for (var i = 0; i < dataList.length; i++){
            for (var j = 0; j < dataList[i].length; j++){
              if (dataList[i][j] == "") continue
              exist = 0
              var z = 0
              for(z=1;z<=colorList.length;z++){
                if (colorList[z-1] == dataList[i][j].courseName){
                  exist = z
                  break
                }
              }
              if(exist==0){
                colorList.push(dataList[i][j].courseName)
                dataList[i][j].color = colorList.length
              }else{
                dataList[i][j].color = z
              }
            }
          }
          that.setData({
            courseList: dataList
          })
          if (!that.data.hasChange){
            that.setData({
              weekIndex: res.data.now-1
            })
            wx.setNavigationBarTitle({
              title: '课程表(' + that.data.weekList[res.data.now-1].value + ')',
            })
          }else{
            wx.setNavigationBarTitle({
              title: '课程表(' + that.data.weekList[that.data.weekIndex].value + ')',
            })
          }
        } else {
          wx.showModal({
            title: '获取课表失败',
            content: res.data.reason,
            showCancel: false
          })
        }
      },
      complete: function () {
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }
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
    wx.setNavigationBarTitle({
      title: '课程表(第1周)',
    })
    this.getTimetable()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  showDetail: function(e) {
    var detail = {
      courseName: e.currentTarget.dataset.coursename,
      courseLocation: e.currentTarget.dataset.courselocation,
      teacherName: e.currentTarget.dataset.teachername,
      courseTime: e.currentTarget.dataset.coursetime,
      courseWeek: e.currentTarget.dataset.courseweek,
      //courseTimeDetail: e.currentTarget.dataset.courseTimeDetail,
    }
    this.setData({
      detail: detail,
      isShowDetail: true
    })
  },
  hideDetail: function() {
    this.setData({
      isShowDetail: false
    })
  }
})