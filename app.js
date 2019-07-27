//app.js
App({
  onLaunch: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    requestUrl: 'https://haibei.yuyisoft.net/',
    // requestUrl: 'http://127.0.0.1:8082/',
    // requestUrl: 'http://remote.yuyisoft.net:8090/',
    semesterList: [
      { id: "2019-2020-1", name: "2019-2020学年第一学期" },
      { id: "2018-2019-2", name: "2018-2019学年第二学期" },
      { id: "2018-2019-1", name: "2018-2019学年第一学期" },
      { id: "2017-2018-2", name: "2017-2018学年第二学期" },
      { id: "2017-2018-1", name: "2017-2018学年第一学期" },
      { id: "2016-2017-2", name: "2016-2017学年第二学期" },
      { id: "2016-2017-1", name: "2016-2017学年第一学期" },
      { id: "2015-2016-2", name: "2015-2016学年第二学期" },
      { id: "2015-2016-1", name: "2015-2016学年第一学期" },
      { id: "2014-2015-2", name: "2014-2015学年第二学期" },
      { id: "2014-2015-1", name: "2014-2015学年第一学期" },
      { id: "2013-2014-2", name: "2013-2014学年第二学期" },
      { id: "2013-2014-1", name: "2013-2014学年第一学期" },
      { id: "2012-2013-2", name: "2012-2013学年第二学期" },
      { id: "2012-2013-1", name: "2012-2013学年第一学期" },
      { id: "2011-2012-2", name: "2011-2012学年第二学期" },
      { id: "2011-2012-1", name: "2011-2012学年第一学期" },
    ],
  }
})