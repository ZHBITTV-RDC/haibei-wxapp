var id = 0;
var page_size = 6;

Page({
  data: {
    loadingNewItem: false,
    list: [],
    activeIndex: 1,
    noMore: false,
    id: 0,
    showMenu: false
  },
  nav: function () {
    this.setData({
      nav_mask: !this.data.nav_mask
    });
  },
  onLoad: function (e) {
    this.setData({
      initOption: e,
      accessToken: e.accessToken
    })
  },
  menuSwitch: function (){
    this.setData({
      showMenu: !this.data.showMenu
    })
  },
  onShow: function () {
    this.getList();
    var that = this
    if (that.data.initOption.id != 0) {
      wx.navigateTo({
        url: 'view?accessToken=' + this.data.accessToken + '&id=' + that.data.initOption.id,
      })
      var initOption = that.data.initOption
      initOption.id=0
      that.setData({
        initOption: initOption
      })
    }
  },
  search: function (){
    if(this.data.keyword){
      this.getListSearch()
    }else{
      this.setData({
        id: 0
      })
      this.getList()
    }
  },
  searchInput: function (e){
    this.setData({
      keyword: e.detail.value
    })
  },
  getList: function () {
    var _this = this
    _this.setData({
      loadingNewItem: true
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        id: _this.data.id,
        size: page_size,
        method: 'getLostList',
        accessToken: _this.data.accessToken,
        type: _this.data.activeIndex
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        if (list.length < 6) {
          _this.setData({
            noMore: true
          })
        }
        if(res.data.list.length == 0){
          return
        }
        for (var i in list) {
          list[i].datetime = _this.timeHandle(list[i].datetime)
        }
        if(_this.data.id == 0){
          _this.setData({
            list: list,
            id: list[list.length - 1].id
          })
        }else{
          var newList = _this.data.list.concat(list)
          _this.setData({
            list: newList,
            id: list[list.length - 1].id
          })
        }
      },
      complete: function () {
        _this.setData({
          loadingNewItem: false
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  getListSearch: function () {
    var _this = this
    wx.showLoading({
      title: '查询中',
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        method: 'getLostList',
        accessToken: _this.data.accessToken,
        type: _this.data.activeIndex,
        keyword: _this.data.keyword
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        if (res.data.list.length == 0) {
          _this.setData({
            list: [],
            noMore: true
          })
          return
        }
        for (var i in list) {
          list[i].datetime = _this.timeHandle(list[i].datetime)
        }
        _this.setData({
          list: list,
          id: 0
        })
      },
      complete: function () {
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  onReachBottom: function (e) {
    this.getList()
  },
  onPullDownRefresh: function(e){
    wx.showNavigationBarLoading()
    this.setData({
      id: 0
    })
    this.getList()
  },

  tabClick: function (e) {
    this.setData({
      list: [],
      activeIndex: e.currentTarget.id,
      id: 0,
      noMore: false
    });
    this.getList()
  },

  onShareAppMessage: function () {
    var that = this;
    var picUrl = that.data.picUrl;
    return {
      title: '来看看大家都捡到了什么',
      path: '/pages/index/index'
    }
  },
  timeHandle: function (time) {  //时间处理
    var today = new Date()
    var y = today.getFullYear();
    var m = today.getMonth() + 1;//获取当前月份的日期 
    var d = today.getDate();
    if (m < 10) {
      m = '0' + m;
    };
    if (d < 10) {
      d = '0' + d;
    }
    var todayStr = y + "-" + m + "-" + d
    var originStr = time.substring(0, 10)
    var day1 = new Date(todayStr)
    var day2 = new Date(originStr)
    var result = (day1 - day2) / 86400000
    if (result == 0) {
      return time.substring(11, 16)
    } else if (result == 1) {
      return "昨天"
    } else if (result == 2) {
      return "前天"
    } else if (result <= 15) {
      return result + "天前"
    } else {
      return time.substring(5, 10)
    }
  }
})
