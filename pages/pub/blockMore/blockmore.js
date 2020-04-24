const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    block: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
  },
  getBlock(num) {
    let that = this;
    return new Promise(
      (resolve, reject) => {
        wx.request({
          url: app.config.getHostUrl() + '/api/pub/getCourses',
          data: {
            num
          },
          success: (res) => {
            if (res.statusCode == 200) {
              resolve(res);
            } else {
              // 服务器故障  标识：500
              reject({
                error: 500,
                errMsg: "服务器故障",
                data: res
              });
            }
          },
          fail: (res) => {
            // 请求错误
            reject({
              error: 400,
              errMsg: "请求错误",
              data: res
            });
          }
        })
      }
    )

  },
  initData(){
    let that=this;
    this.getBlock(6).then(res=>{
      res.data.data.forEach(e => {
        e.imgLink = "../blockDetail/blockDetail?rcid=" + e.rcid
      })
      that.setData({
        block: res.data.data
      })
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that=this;
    this.getBlock(6).then(res=>{
      if(res.data.data.lenthg){
        res.data.data.forEach(e => {
          e.imgLink = "../blockDetail/blockDetail?rcid=" + e.rcid
        })
        that.setData({
          block: res.data.data
        })
      }else{
        Toast("没有更多了");
      }
    }).catch(res=>{
      console.log(res)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})