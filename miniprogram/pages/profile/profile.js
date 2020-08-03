// pages/profile/profile.js
Page({
  data: {
    userInfo: {},
    btnText:'授权登录'
  },
  handleGetUserInfo(e) {
    getApp().globalData.userInfo = JSON.parse(e.detail.rawData)
    this.setData({
      userInfo: getApp().globalData.userInfo,
      btnText:getApp().globalData.userInfo.nickName
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getUserInfo()
    console.log(getApp().globalData)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  onShow() {
    this._getUserInfo()
    console.log(getApp().globalData.userInfo)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  _getUserInfo() {
    if (JSON.stringify(getApp().globalData.userInfo) === '{}') {
      wx.showLoading({
        title: '获取用户信息啦...',
      })
      console.log('用户信息为空，开始获取信息')
      wx.getUserInfo({
          lang: 'zh_CN',
        })
        .then(v => {
          console.log(v)
          wx.hideLoading()
          getApp().globalData.userInfo = JSON.parse(v.rawData)
          this.setData({
            userInfo: getApp().globalData.userInfo,
            btnText:getApp().globalData.userInfo.nickName
          })
        })
        .catch(e => {
          console.log('获取用户授权失败：')
          console.log(e)
          wx.hideLoading()
          wx.showToast({
            title: '点击按钮授权哦~',
          })
        })
    } else {
      this.setData({
        userInfo: getApp().globalData.userInfo,
        btnText:getApp().globalData.userInfo.nickName
      })
    }
  }
})