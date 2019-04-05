var util = require('../../utils/util.js') //引入微信自带的日期格式化
Page({
  /**
   * 页面的初始数据
   */
  data: {
    headList: [
      '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'
    ],
    chineseList: {
      "一": 1, "二": 2, "三": 3,"四":4,"五":5,"六":6,"七":7,"八":8,"九":9,"十":10,"十一":11,"十二":12,"十三":13,"十四":14,"十五":15,"十六":16,"十七":17,"十八":18,"十九":19,"二十":20
    },
    data: {},
    longHoliday: [],
    tips: [],
    today: util.formatDateWithMonthAndDay(new Date),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '校历',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2da0fd',
    })
    that.setData({
      accessToken: options.accessToken
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'xl.json',
      success: function(res){
        that.setData({
          data:res.data.xiaoliData,
          longHoliday: res.data.longHolidayData,
          tips: res.data.tips
        })
      }
    })
  },
  checkTimetable: function(e){
    var t = this
    wx.navigateTo({
      url: './timetable?accessToken='+t.data.accessToken + "&weekIndex="+e.currentTarget.dataset.week,
    })
  }
})