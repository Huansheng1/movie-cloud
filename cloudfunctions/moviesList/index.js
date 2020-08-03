// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const axios = require('axios')
const http = axios.create({
  timeout: 6000
})
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.type === 'getMoviesList') {
    return await http.get(`http://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&start=${event.startPage}&count=${event.limitNumber}`)
      .then(v => {
        console.log(v)
        return v.data
      })
      .catch(e => {
        console.log('异常捕获：')
        console.log(e)
      })
  } else if (event.type === 'getMovieDetail') {
    return await http.get(`http://api.douban.com/v2/movie/subject/${event.movieId}?apikey=0df993c66c0c636e29ecbb5344252a4a`)
      .then(v => {
        console.log(v)
        return v.data
      })
      .catch(e => {
        console.log('异常捕获：')
        console.log(e)
      })
  }

}