//index.js
//获取应用实例
const app = getApp()
var t = null
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    jwid: "",
    jwpwd: "",
    accessToken: null,
    hasBind: false,
    classData: {},
    additionFunction: [],
    isRefreshing: false,
    hasLoadHw: false,
    homeworkNum: 0,
    homeworkList: [],
    hasLoadTimeTable: false,
    courseData: null,
    informationList: [],
    unReadList: [],
    unReadTitle: "",
    unReadTime: "",
    isShowDetail: false
  },

  showDetail: function (e) {
    this.setData({
      isShowDetail: true
    })
  },
  hideDetail: function () {
    this.setData({
      isShowDetail: false
    })
  },
  newStudent: function(e){
    this.setData({
      navigateToNewStudentBind: true
    })//设置跳转的页面是绑定新生页面
    wx.navigateTo({
      url: '/new/pages/index?accessToken=' + this.data.accessToken ,
    })
  },
  idHandle: function(e){
    this.setData({
      jwid: e.detail.value
    })
  },
  pwdHandle: function (e) {
    this.setData({
      jwpwd: e.detail.value
    })
  },
  tip: function (e){
    wx.showModal({
      title: '提示',
      content: '此功能仍在开发中，敬请期待',
      showCancel: false
    })
  },
  getHwInfo: function(){
    var that = this
    that.setData({
      isRefreshing: true
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        method: 'homework',
        accessToken: that.data.accessToken
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            hasLoadHw: true,
            homeworkNum: res.data.homeworkNum,
            homeworkList: res.data.homeworkList,
          })
        }
      },
      complete: res => {
        that.setData({
          isRefreshing: false
        })
      }
    })
  },
  unBindNewStudent: function(){  //取消绑定新生信息
    var that = this
    wx.request({
      url: getApp().globalData.requestUrl + 'newStudent.php',
      data: {
        accessToken: that.data.accessToken,
        method: 'unBind'
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(){
        wx.showModal({
          title: '解绑新生数据成功',
          content: '恭喜你加入北理珠！！！',
          showCancel: false
        })
        that.setData({
          newStudentInfo: null,
          hasBindNewStudent: false
        })
      }
    })
  },
  loginSystem: function(code){
    var that = this
    wx.request({
      url: getApp().globalData.requestUrl + 'onLogin.php',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        code: code
      },
      success: function (res) {
        if (res.data.status == 0) {
          wx.showModal({
            title: '小程序登录失败',
            content: '请重新打开小程序',
            showCancel: false
          })
          return
        }
        that.setData({
          accessToken: res.data.accessToken,
          additionFunction: res.data.additionFunction,
          registerInfo: res.data.registerInfo,
          openNewStudentRegister: res.data.openNewStudentRegister
        })
        if (res.data.hasBind == 1) {  //判断是否已经绑定了小程序
          that.setData({
            hasBind: true,
            classData: res.data.classData,
          })
          if(res.data.registerInfo.remain<0){  //判断是否已经开学，如果是则查询课表等信息
            that.getHwInfo()
            that.getTimetable()
            that.getInformation()
            //that.getJwNoticeDetail()
          }
        }else{
          if (res.data.openNewStudentRegister){
            that.checkNewStudentBind()
          }
        }
        if(that.data.initOption){
          if (that.data.initOption.f == "lost"){
            wx.navigateTo({
              url: '/lost/pages/lost?id=' + that.data.initOption.id + "&accessToken=" + res.data.accessToken,
            })
            that.setData({
              initOption: null
            })
          }
        }
      },
      fail: function () {
        wx.showModal({
          title: '小程序登录失败',
          content: '无法连接到服务器，请稍候再试',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  getJwNoticeDetail: function() {
    var that = this
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        accessToken: that.data.accessToken,
        method: "getJwNoticeDetail"
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  },
  onLoad: function (e) {
    var that = this
    if(e.scene){
      var scene = decodeURIComponent(e.scene)
      let f = scene.split(".")[0];
      let id = scene.split('.')[1];
      let initOption={f:f,id:id}
      this.setData({
        initOption: initOption
      })
    }
    wx.showLoading({
      title: '登录小程序中',
    })
    wx.login({
      success(res) {
        if (res.code) {
          that.loginSystem(res.code)
        } else {
          wx.showModal({
            title: '小程序登录失败',
            content: '请重新打开小程序',
            showCancel: false
          })
        }
      },
      fail(res){
        wx.showModal({
          title: '小程序登录失败',
          content: '请重新打开小程序',
          showCancel: false
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getInformation: function() {
    var that = this
    var lastId = 0
    try {
      const value = wx.getStorageSync('lastId')
      if(value) lastId=value
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
          if (res.data.informationList.length>0){
            const list = wx.getStorageSync('information')
            if(list){
              wx.setStorage({
                key: 'information',
                data: res.data.informationList.concat(list)
              })
              that.setData({
                informationList: res.data.informationList.concat(list),
              })
            }else{
              wx.setStorage({
                key: 'information',
                data: res.data.informationList
              })
              that.setData({
                informationList: res.data.informationList,
              })
            }
            wx.setStorage({
              key: 'lastId',
              data: res.data.lastId
            })
          }
          const list = wx.getStorageSync('information')
          var unReadList = []
          for(var i in list){
            if(!list[i].hasRead){
              unReadList.push({title: list[i].title,time: list[i].time})
            }
          }
          if (unReadList.length > 0){
            that.setData({
              unReadTitle: unReadList[0].title,
              unReadTime: unReadList[0].time
            })
          }
          that.setData({
            unReadList: unReadList
          })
          wx.stopPullDownRefresh()
        }
      })
    } catch (e) {
      // Do something when catch error
    }
  },
  onHide: function(){
    clearInterval(t)
  },
  onShow: function(){
    if (this.data.navigateToNewStudentBind == true) {  //如果页面是从绑定页面返回的
      this.checkNewStudentBind()
      this.setData({
        navigateToNewStudentBind: false
      })
    }
    //如果已经绑定则获取通知信息
    if(!this.data.hasBind) return
    var that = this
    const list = wx.getStorageSync('information')
    var unReadList = []
    for (var i in list) {
      if (!list[i].hasRead) {
        unReadList.push({ title: list[i].title, time: list[i].time })
      }
    }
    if (unReadList.length > 0) {
      that.setData({
        unReadTitle: unReadList[0].title,
        unReadTime: unReadList[0].time
      })
    }
    that.setData({
      unReadList: unReadList
    })
  },
  checkNewStudentBind: function (){
    if (this.data.hasBind) return; //如果已经绑定了系统则忽略
    var that = this
    wx.request({
      url: getApp().globalData.requestUrl + 'newStudent.php',
      data: {
        accessToken: that.data.accessToken,
        method: 'check'
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        if(res.data.status == 1){  //如果已绑定新生信息
          that.setData({
            newStudentInfo: res.data,
            hasBindNewStudent: true,
            registerInfo: res.data.registerInfo
          })
        }
      }
    })
  },
  getTimetable: function () {
    var that = this
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        accessToken: that.data.accessToken,
        method: "timetable"
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status) {
          that.setData({
            hasLoadTimeTable: true,
            courseData: res.data.courseData
          })
        }else{
          wx.showModal({
            title: '查询课表失败',
            content: res.data.reason,
            showCancel: false
          })
        }
      }
    })
  },

  getUserInfo: function (e) {
    if (e.detail.errMsg != "getUserInfo:fail auth deny"){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },
  unBind:function(){
    var that = this
    wx.showLoading({
      title: '解绑中',
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        method: 'unBind',
        accessToken: that.data.accessToken
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            hasBind: false,
            classData: {},
            hasLoadHw: false,
            hasLoadTimeTable: false,
            homeworkNum: 0,
            homeworkList: [],
            courseData: [],
            informationList: [],
            unReadList: [],
            unReadTitle: "",
            unReadTime: "",
          })
          clearInterval(t)
          wx.showModal({
            title: '解绑成功',
            content: '解绑成功，我们期待你的回来哦',
            showCancel: false
          })
        }
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  },
  unBindStudent: function(){
    var that = this
    wx.showModal({
      title: '解绑确认',
      content: '请不要解绑我好吗，我能为你提供更多服务的',
      cancelText: '不解绑了',
      confirmText: '决定解绑',
      cancelColor: '#008000',
      confirmColor: '#FF0000',
      success:function(e){
        if(e.confirm){
          that.unBind()
        }
      }
    })
  },
  openUrl: function(e){
    var that = this
    if (e.currentTarget.dataset.needbind && !that.data.hasBind){
      wx.showModal({
        title: '未绑定学号',
        content: '请先绑定教务系统账号哦',
        showCancel: false
      })
      return 
    }
    wx.navigateTo({
      url: './web?url=' + e.currentTarget.dataset.url + '&accessToken=' + that.data.accessToken,
    })
  },
  bindStudent: function(e){
    var that = this
    wx.showLoading({
      title: '正在绑定中...',
    })
    wx.request({
      url: getApp().globalData.requestUrl + 'api.php',
      data: {
        jwid: that.data.jwid,
        jwpwd: that.data.jwpwd,
        accessToken: that.data.accessToken,
        method: "signin"
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        if(res.data.status){
          that.setData({
            hasBind: true,
            classData: res.data.classData,
          })
          that.getHwInfo()
          that.getTimetable()
          that.getInformation()

        }else{
          wx.showModal({
            title: '绑定失败',
            content: res.data.reason,
            showCancel: false
          })
        }
      },
      complete:function(){
        wx.hideLoading()
      }
    })
  },
  checkEMS: function(e){
    if (e.currentTarget.dataset.ems != "录取通知书未发出"){
      wx.navigateToMiniProgram({
        appId: 'wx6885acbedba59c14',
        path: 'pages/result/result?nu=' + e.currentTarget.dataset.ems +'&querysource=third_xcx'
      })
    }else{
      wx.showModal({
        title: '暂无法查询',
        content: '录取通知书暂未发出，无法进行快递查询',
        showCancel: false
      })
    }
  },
  onPullDownRefresh:function(){
    this.getInformation()
  },

  openFunction:function(e){
    var that = this
    if (e.currentTarget.dataset.needbind == "true" && that.data.hasBindNewStudent) {
      wx.showModal({
        title: '功能暂不可用',
        content: '此功能需要您绑定教务账号才能使用哦，新生请点击[我已入学]按钮并重新绑定教务系统哦',
        showCancel: false
      })
      return
    }
    if (e.currentTarget.dataset.needbind == "true" && !that.data.hasBind){
      wx.showModal({
        title: '未绑定学号',
        content: '请先绑定教务系统账号哦',
        showCancel: false
      })
      return
    }
    wx.navigateTo({
      url: './' + e.currentTarget.dataset.function + '?id=0&accessToken=' + that.data.accessToken,
    })
  },
  onShareAppMessage: function () {
    return {
      title: '口袋北理-北理珠学生必备校园小程序',
      path: '/pages/index/index2'
    }
  }
})
