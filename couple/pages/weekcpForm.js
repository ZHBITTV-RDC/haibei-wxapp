//index.js
//获取应用实例
const app = getApp()
const qiniuUploader = require("../../utils/qiniuUploader");

Page({
  data: {

    //submit Button
    subSrc: '../img/sub1.svg',
    //check Sex
    sex: 0,
    girlBg: "",
    boyBg: "",
    //Picker
    info: [
      ['大一', '大二', '大三', '大四'],
      ['信息学院', '计算机学院', '工业自动化学院', '材料与环境学院', '航空学院', '数理与土木工程学院', '商学院', '会计与金融学院', '外国语学院', '民商法律学院', '设计与艺术学院', '继续教育学院', '布莱恩特学院', '中美国际学院'],
      ['电子信息类', '电子科学与技术', '信息工程', '通信工程', '智能科学与技术', '自动化', '电气工程及其自动化', '通信工程3+2', '通信工程2+2'],
      ["1班", "2班", "3班", "4班", "5班", "6班", "7班", "8班", "9班", "10班"]
    ],
    idx: [0, 0, 0, 0],
    showPop: false
  },//data end
  // 年级显示
  bindPickerChange: function (e) {
    console.log('年级显示改变，携带值为', e.detail.value)//test
    this.setData({
      idx: e.detail.value
    })
  },

  bindPickerColumnChange: function (e) {
    console.log(e.detail);//test
    console.log('第', e.detail.column, '列在滚动', '滚动值为', e.detail.value);//test
    var data = {
      info: this.data.info,//[nianji,xueyuan,zhuanye]
      idx: this.data.idx//[num,num,num]
    };
    data.idx[e.detail.column] = e.detail.value;//改变滚动值
    console.log(data.idx);//test
    switch (e.detail.column) { //滚动的是哪列
      case 0: //滚动第一列：选择年级
        break;
      case 1: //滚动第二列：选择学院
        data.idx[2] = 0; //设置第三列默认index
        switch (data.idx[1]) { //学院对应哪些专业
          case 0:
            data.info[2] = ['电子信息类', '电子科学与技术', '信息工程', '通信工程', '智能科学与技术', '自动化', '电气工程及其自动化', '通信工程3+2', '通信工程2+2']
            break;
          case 1:
            data.info[2] = ['计算机大类', '软件工程', '网络工程', '计算机科学与技术', '软件工程3+2', '数字媒体技术3+2', '软件工程2+2', '数字媒体技术2+2', '数字媒体技术']
            break;
          case 2:
            data.info[2] = ['车辆工程', '能源与动力工程', '机械电子工程', '机器人工程', '工业工程', '机械设计制造及其自动化', '机械工程3+2', '机械工程', '机械类']
            break;
          case 3:
            data.info[2] = ['材料科学与工程', '化学工程与工艺', '环境工程', '生物工程', '应用化学', '食品科学与工程', '安全工程']
            break;
          case 4:
            data.info[2] = ['无人驾驶航空器系统工程', '飞行技术', '飞行器制造工程', '交通运输', '机场运行控制与管理', '通用航空飞行技术方向', '航空服务与管理方向']
            break;
          case 5:
            data.info[2] = ['数据科学与大数据技术', '应用统计学', '土木工程', '测控技术与仪器', '应用物理学', '大数据统计技术', '金融统计与精算方向']
            break;
          case 6:
            data.info[2] = ['信息管理与信息系统', '市场营销', '国际经济与贸易', '物流管理', '人力资源管理', '国际商务', '工程管理', '国际商务3+2', '国际商务2+2']
            break;
          case 7:
            data.info[2] = ['会计学', '国际商务会计学', '财务管理', '金融管理', '信用管理', '审计学', '会计学3+2', '会计学2+2']
            break;
          case 8:
            data.info[2] = ['商务英语', '英语', '日语', '汉语国际教育', '翻译']
            break;
          case 9:
            data.info[2] = ['法学', '法学国际班']
            break;
          case 10:
            data.info[2] = ['数字媒体艺术', '视觉传达设计', '环境设计', '服装与服饰', '服装设计与工程', '产品设计', '工艺美术']
            break;
          case 11:
            data.info[2] = ['采购与供应管理', '文秘', '公共关系', '国际贸易实务', '计算机信息管理', '物流管理', '机电一体化', '计算机及应用', '工商企业管理', '旅游管理', '市场营销', '行政管理', '人力资源管理', '销售管理', '法律事务', '学前教育', '环境工程', '商务英语', '会计', '服装与服饰设计', '电子商务', '金融管理', '商务管理', '建筑工程', '广告设计与制作', '动漫设计', '视觉传播设计与制作', '环境艺术设计', '大数据开发与分析', '人工智能应用开发', '数字媒体艺术', '跨境电商运营', '酒店管理', '高铁服务与管理', '银行服务与管理', '民航服务与管理', '国际空乘']
            break;
          case 12:
            data.info[2] = ['会计学专业4+0', '会计学专业2+2', '国际商务2+2', '财务管理3+2']
            break;
          case 13:
            data.info[2] = ['财务管理', '金融工程', '国际商务', '计算机科学与技术', '会计学', '市场营销', '应用统计学', '金融数学', '市场营销2+2', '市场营销4+1']
            break;
        }
        break;
    }
    this.setData(data);
  },

  //submit button image
  clickStart: function (e) {
    this.setData({
      subSrc: '../img/sub2.svg'
    })
  },
  clickEnd: function (e) {
    var that = this;
    that.setData({
      subSrc: '../img/sub1.svg'
    })
    // function changeBack() {
    //   that.setData({
    //     subSrc: '../img/sub1.svg'
    //   })
    // }
    //setTimeout(changeBack, 500);
  },
  enroll: function (e) {  //这里是表单提交事件
    // 这里要用wx.request事件提交post
    // 示例
    console.log(e)
    for(var i in e.detail.value){
      if (e.detail.value.photo == "" || !e.detail.value.photo){
        wx.showModal({
          title: '报名信息不全',
          content: '要上传你的照片哦',
          showCancel: false
        })
        return
      }
      if (e.detail.value[i] == "" || !e.detail.value[i]){
        wx.showModal({
          title: '报名信息不全',
          content: '全部信息都要输入哦',
          showCancel: false
        })
        return
      }
    }
    wx.request({
      // 网址 https://haibei.cdn.yuyisoft.net/oneWeekCouple/index.php
      url: 'https://haibei.yuyisoft.net/oneWeekCouple/index.php',
      data: {
        'name1': e.detail.value.name1,
        'sex': e.detail.value.sex,
        'grade': e.detail.value.grade,
        'phone': e.detail.value.phone,
        'weixin': e.detail.value.weixin,
        'hobby': e.detail.value.hobby,
        'lixiangxing': e.detail.value.lixiangxing,
        'photo': e.detail.value.photo
      }, //这里需要提交的信息，这里是表单信息
      method: "POST",  //method为POST
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },  //设置头上传方式，必备
      success: res => {
        //res.data为服务器返回的信息，使用json哦
        if(res.data.status){
          wx.showModal({
            title: '报名成功',
            content: '恭喜你报名成功',
            showCancel: false
          })
        }
      }
    })
  },
  // 选择性别的样式
  boy: function (e) {
    this.setData({
      sex: 0,
      girlBg: "",
      boyBg: "background:pink;color:#000"
    })
  },

  girl: function (e) {
    this.setData({
      sex: 1,
      girlBg: "background:pink;color:#000",
      boyBg: ""
    })
  },

  // window
  openPop: function (e) {
    this.setData({
      showPop: true
    })
  },
  closePop: function (e) {
    this.uploadImg(this.data.localPhoto)
    // console.log(e);//test
    // this.setData({
    //   showPop: false
    // })
  },
  onLoad: function (options) {
    var that = this
    this.setData({
      accessToken: options.accessToken
    })
    wx.request({
      url: 'https://haibei.yuyisoft.net/oneWeekCouple/getToken.php',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        that.setData({
          uploadToken: res.data.token
        })
      }
    })

  },
  getPhone: function (e) {
    var that = this
    this.setData({
      getingPhone: true
    })
    if (e.detail.errMsg != "getPhoneNumber:fail user deny") {
      wx.request({
        url: getApp().globalData.requestUrl + 'getPhone.php',
        data: {
          accessToken: that.data.accessToken,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (e) {
          if (e.data.status) {
            that.setData({
              phone: e.data.phone
            })
          } else {
            wx.showModal({
              title: '自动填写手机号失败',
              content: e.data.reason,
              showCancel: false
            })
          }
        },
        complete: function () {
          that.setData({
            getingPhone: false
          })
        }
      })
    }
  },
  chooseImg: function(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        that.setData({
          localPhoto: tempFilePaths[0],
          showPop: true
        })
      }
    })
  },
  uploadImg: function (filePath){
    var that = this
    qiniuUploader.upload(filePath, (res) => {
      that.setData({
        'imageURL': res.imageURL,
      });
      console.log('file url is: ' + res.fileUrl);
    }, (error) => {
      wx.showModal({
        title: '上传失败',
        content: '上传图片失败，请重试',
        showCancel: false
      })
      }, {
        region: 'SCN',
        domain: 'http://haibei.cdn.yuyisoft.net',
        uptoken: that.data.uploadToken
      }, (res) => {
        console.log('上传进度', res.progress)
        console.log('已经上传的数据长度', res.totalBytesSent)
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      }, () => {
        // 取消上传
      }, () => {
        // `before` 上传前执行的操作
        wx.showLoading({
          title: '上传中',
        })
      }, (err) => {
        // `complete` 上传接受后执行的操作(无论成功还是失败都执行)
        wx.hideLoading()
        that.setData({
          showPop: false
        })
      });
  }
})