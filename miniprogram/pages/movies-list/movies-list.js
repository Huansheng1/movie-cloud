// pages/movies-list/movies-list.js
Page({
  data: {
    moviesList: [],
    startPage: 0,
    limitNumber: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getMoviesList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.moviesList = []
    this._getMoviesList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getMoviesList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  enterDetail(event){
    console.log(event)
    wx.navigateTo({
      url: '../detail/detail?moviesId=' + event.currentTarget.dataset.moviesid,
    })
  },
  _getMoviesList() {
    wx.showLoading({
      title: '请求数据中',
    })
    wx.cloud.callFunction({
      name: 'moviesList',
      data: {
        type: 'getMoviesList',
        limitNumber: this.data.limitNumber,
        startPage: this.data.startPage
      }
    }).then(v => {
      wx.hideLoading()
      console.log('获取电影列表成功：')
      console.log(v)
      this.setData({
        moviesList: this.data.moviesList.concat(v.result.subjects),
        startPage: this.data.startPage + 1
      })
      wx.showToast({
        title: '请求数据成功！',
      })
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '请求数据失败，请稍后再试',
      })
      console.log('请求云函数获取电影列表异常：')
      console.log(e)
    })
  }
})