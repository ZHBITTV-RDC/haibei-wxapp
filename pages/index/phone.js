// pages/index/phone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneList: [
      {logo: '/img/guanli.png',
        phone: [
          {name: '学院办公室',phone:'0756-3622699'}
        ]
      },
      {
        logo: '/img/student.png',
        phone: [
          { name: '处长电话', phone: '0756-3622511' },
          { name: '团委数据', phone: '0756-3622512' },
          { name: '事务中心', phone: '0756-3622513' },
          { name: '学生资助', phone: '0756-3622667' }
        ]
      },
      {
        logo: '/img/live.png',
        phone: [
          { name: '校内报警电话', phone: '0756-3622110' },
          { name: '后勤保卫处', phone: '0756-3622621' },
          { name: '网络中心', phone: '0756-3622741' }
        ]
      },
      {
        logo: '/img/hospital.png',
        phone: [
          { name: '中大五院', phone: '0756-3622120' },
          { name: '中山大学附属第五医院(急救)', phone: '0756-2528120' },
          { name: '中山大学附属第五医院(门诊)', phone: '0756-2528171' },
          { name: '珠海市金鼎医院', phone: '0756-3381211' }
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  call: function (e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})