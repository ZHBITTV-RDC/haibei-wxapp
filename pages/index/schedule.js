var weeksArray = [];

var GetDepartment_info = function (that) {
  var urlStr = 'http://123.56.180.48:9080/jklApi/rest/' + 'goldDepartment/getHomePageData/' + '8a819ee651431b2701514386fa050008';
  console.log('科室详情的url：' + urlStr);

  wx.request({
    url: urlStr,
    method: "GET",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'mhealthkey': '1'
    },
    success: function (res) {
      console.log("科室详情：" + JSON.stringify(res));

      var sList = res.data.data.scheduleInfo;
      var sch_listData = dealData(sList);

      that.setData({

        sch_listData: sch_listData,

      });
    },
    fail: function (e) {
      that.setData({
        loadingHidden: true,
      })
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sch_listData: [],
    dateArray: [],
    headList: [
      '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'
    ],
    data: {
      '': [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, 
      { value: "23", isHoliday: true }, { value: "24", isHoliday: true }],
      '一': [{ value: "25" }, { value: "26" }, { value: "27" }, { value: "28" }, { value: "3月",isMonth:true},
      { value: "2", isHoliday: true }, { value: "3", isHoliday: true }],
    },
    longHoliday: [
      ["8", "15", "22", "29", "5", "12", "19", "26"],
      ["9", "16", "23", "30", "6", "13", "20", "27"],
      ["9", "16", "23", "30", "6", "13", "20", "27"],
      ["9", "16", "23", {value:"8月" , isMonth:true}, "6", "13", "20", "27"],
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '校历',
    })
  }
})