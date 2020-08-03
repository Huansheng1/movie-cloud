let cloudPath = []
const db = wx.cloud.database()
Page({
  data: {
    movieDetail: {},
    fileList: [],
    movieId: -1,
    starValue: 5,
    scoreText: '',
    buttonText: '提交评价'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.moviesId)
    this.setData({
      movieId: options.moviesId
    })
    this._getMovieDetail(this.data.movieId)
  },

  beforeRead(event) {
    console.log(event.detail)
    const {
      file,
      callback
    } = event.detail;
    callback(true);
  },
  afterRead(event) {
    console.log(event.detail)
    this.setData({
      fileList: event.detail.file
    })
    this.uploadToCloud()
  },
  uploadToCloud() {
    const {
      fileList
    } = this.data;
    if (!fileList.length) {
      wx.showToast({
        title: '请选择图片',
        icon: 'none'
      });
    } else {
      const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`my-photo${index}.png`, file));
      Promise.all(uploadTasks)
        .then(data => {
          console.log('全部图片上传成功结果：')
          console.log(data)
          wx.showToast({
            title: '上传成功',
            icon: 'none'
          });
          const newFileList = data.map(item => {
            console.log(item)
            return {
              url: item.fileID
            }
          });
          console.log('newFileList结果：')
          console.log(newFileList)
          this.setData({
            cloudPath: data,
            fileList: newFileList
          });
        })
        .catch(e => {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          });
          console.log(e);
        });
    }
  },
  uploadFilePromise(fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.path
    });
  },
  onChange(e) {
    this.setData({
      starValue: e.detail
    })
  },
  bindFormSubmit: function (e) {
    wx.showLoading({
      title: '提交评价中...',
    })
    this.setData({
      buttonText: "提交评价中...",
      scoreText: e.detail.value.scoreText
    })
    db.collection('movieScore').add({
        data: {
          pictureFileList: this.data.fileList,
          movieId: this.data.movieId,
          starValue: this.data.starValue,
          scoreText: this.data.scoreText
        }
      })
      .then(v => {
        wx.hideLoading()
        wx.showToast({
          title: '提交评价成功',
        })
        this.setData({
          buttonText: "提交评价"
        })
      })
      .catch(e=>{
        wx.hideLoading()
        wx.showLoading({
          title: '提交评价失败，请稍后再试...',
        })
        console.log(e)
      })
  },
  _getMovieDetail(movieId) {
    wx.showLoading({
      title: '请求数据中',
    })
    wx.cloud.callFunction({
      name: 'moviesList',
      data: {
        type: 'getMovieDetail',
        movieId: movieId
      }
    }).then(v => {
      wx.hideLoading()
      console.log('获取电影详情成功：')
      console.log(v)
      this.setData({
        movieDetail: v.result,
      })
      wx.showToast({
        title: '请求数据成功！',
      })
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '请求数据失败，请稍后再试',
      })
      console.log('请求云函数获取电影详情异常：')
      console.log(e)
    })
  }
})