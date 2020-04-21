const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperArr: [{
      imgUrl: "/imgs/default/boy.jpg",
      imgLink: "swiperDetail/swiperDetail"
    }],
    list: [{
        imgUrl: "/imgs/default/girl.jpg",
        text: "关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑",
        link: "listDetail/listDetail",
      },
      {
        imgUrl: "/imgs/default/girl.jpg",
        text: "关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑",
        link: "listDetail/listDetail",
      },
      {
        imgUrl: "/imgs/default/girl.jpg",
        text: "关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑",
        link: "listDetail/listDetail",
      },
      {
        imgUrl: "/imgs/default/girl.jpg",
        text: "关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑",
        link: "listDetail/listDetail",
      },
      {
        imgUrl: "/imgs/default/girl.jpg",
        text: "关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑",
        link: "listDetail/listDetail",
      },
    ],
    block: [{
        imgUrl: "/imgs/default/girl.jpg",
        text: "关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑",
        link: "blockDetail/blockDetail",
      },
      {
        imgUrl: "/imgs/default/girl.jpg",
        text: "关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑关于跑步，你要避免的坑",
        link: "blockDetail/blockDetail",
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSwiper();
    this.getList();
  },

  // 获取轮播列表
  getSwiper(){
    wx.request({
      url: app.config.getHostUrl() + '/api/pub/getSwipper',

      success: (res) => {
        // if (res.data.isSuccess) {
          console.log(res.data)
        // }
      },
    });
  },

  getList(){
    wx.request({
      url: app.config.getHostUrl() + '/api/pub/getList',
      method:"POST",
      success: (res) => {
        // if (res.data.isSuccess) {
        console.log(res.data)
        // }
      },
    });
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