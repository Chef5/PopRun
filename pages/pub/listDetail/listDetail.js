const app = getApp();
let user = app.getUser();
let acid = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listDetail: {},
    signNum: 0,
    signIcon: "plus",
    signDisabled: false,
    signType: "primary",
    signText: "报名"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    acid = options;
    this.getListDetail();
    this.getSignNum();
    this.signSearch()
  },
  // 获取活动详情
  getListDetail() {
    let that = this;
    wx.request({
      url: app.config.getHostUrl() + '/api/pub/getDetail',
      data: acid,
      success: (res) => {
        if (res.data.isSuccess) {
      
          let dateNow = Date.parse(new Date());
          let dateStart = Date.parse(new Date(res.data.data.created_at));
          let dateEnd = Date.parse(new Date(res.data.data.period));
          if (dateNow > dateEnd) {
            that.setData({
              signDisabled: true,
              signType: "default",
              signIcon: "",
              signText: "活动已结束!"
            })
          }
          if (dateNow < dateStart) {
            that.setData({
              signDisabled: true,
              signType: "default",
              signIcon: "",
              signText: "活动还未开始哦~"
            })
          }
          that.setData({
            listDetail: res.data.data
          })
        }
      },
    });
  },
  // 获取已报名人数
  getSignNum() {
    let that = this;
    wx.request({
      url: app.config.getHostUrl() + '/api/pub/getSignNum',
      data: acid,
      success: (res) => {
        if (res.data.isSuccess) {
          that.setData({
            signNum: res.data.data
          })
        }
      }
    })
  },
  // 报名参加活动
  signActivity() {
    let that = this;
    if (!user) {
      user = wx.getStorageSync('user');
      if (!user) return;
    }
    // 判断是否报名
    
    wx.request({
      url: app.config.getHostUrl() + '/api/pub/signActivity',
      header: {
        "Content-Type": "application/json"
      },
      method: "POST",
      data: {
        rid: user.rid,
        acid:acid.acid,
      },
      success: (res) => {
        this.signSearch()
          this.getSignNum();
        // }
      }
    })
  },
  // 查询用户是否已报名
  signSearch() {
    let that = this;
    wx.request({
      url: app.config.getHostUrl() + '/api/pub/signActivityCheck',
      data: {
        rid: user.rid,
        acid:acid.acid,
      },
      success: (res) => {
        if (res.data.data) {
          that.setData({
            signDisabled: true,
            signIcon: "success",
            signText: "已报名"
          })
          return;
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

  }
})