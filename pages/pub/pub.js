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
        } else {
          console.warn("getSwiper API error:", res.data.msg);
          Toast.fail(res.data.msg || '加载轮播图失败');
        }
      },
      fail: (err) => {
        console.error("getSwiper request failed:", err);
        Toast.fail('加载轮播图网络失败');
      }
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
        } else {
          console.warn("getList API error:", res.data.msg);
          Toast.fail(res.data.msg || '加载活动列表失败');
        }
      },
      fail: (err) => {
        console.error("getList request failed:", err);
        Toast.fail('加载活动列表网络失败');
      }
    });
  },
  // 获取课程
  getBlock() {
    let that=this;
    wx.request({
      url: app.config.getHostUrl() + '/api/pub/getCourses',
      success: (res) => {
        if (res.statusCode === 200 && res.data.isSuccess) {
          res.data.data.forEach(e => {
            e.imgLink = "blockDetail/blockDetail?rcid=" + e.rcid
          })
          that.setData({
            block: res.data.data
          })
        } else {
          console.warn("getBlock API error or non-200 status:", res.data.msg, "status:", res.statusCode);
          Toast.fail(res.data.msg || '加载课程失败');
        }
      },
      fail: (err) => {
        console.error("getBlock request failed:", err);
        Toast.fail('加载课程网络失败');
      }
    })
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getSwiper();
    this.getList();
    this.getBlock();
    app.stopRefresh();
  }

})