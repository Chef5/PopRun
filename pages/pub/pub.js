const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperArr: [],
    list: [],
    block: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSwiper();
    this.getList();
    this.getBlock();
  },

  // 获取轮播列表
  getSwiper() {
    let that = this;
    wx.request({
      url: app.config.getHostUrl() + '/api/pub/getSwipper',
      success: (res) => {
        if (res.data.isSuccess) {
          res.data.data.forEach(e => {
            e.imgLink = "listDetail/listDetail?acid=" + e.acid
          })
          that.setData({
            swiperArr: res.data.data
          })
        }
      },
    });
  },
  // 获取活动
  getList() {
    let that = this;
    wx.request({
      url: app.config.getHostUrl() + '/api/pub/getList',
      header: {
        "Content-Type": "application/json"
      },
      data: {
        "pageindex": 0,
        "pagesize": 5
      },
      method: "POST",
      success: (res) => {
        if (res.data.isSuccess) {
          res.data.data.activitys.forEach(e => {
            e.imgLink = "listDetail/listDetail?acid=" + e.acid
          })
          that.setData({
            list: res.data.data.activitys
          })
        }
      },
    });
  },
  // 获取课程
  getBlock() {
    let that=this;
    wx.request({
      url: app.config.getHostUrl() + '/api/pub/getCourses',
      success: (res) => {
        if (res.data.isSuccess) {
          if (res.data.isSuccess) {
            res.data.data.forEach(e => {
              e.imgLink = "blockDetail/blockDetail?rcid=" + e.rcid
            })
            that.setData({
              block: res.data.data
            })
            // console.log(res);
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

})