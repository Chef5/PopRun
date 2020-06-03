
import Toast from '@vant/weapp/toast/toast';
const app = getApp();
Page({

  data: {
    list: [],
    pageindex: 0,
    pagesize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData()
  },
  initData() {
    let that = this;
    this.getList(0, 10).then(res => {
      res.data.data.activitys.forEach(e => {
        e.imgLink = "../listDetail/listDetail?acid=" + e.acid
      })
      that.setData({
        list: res.data.data.activitys,
        pageindex: res.data.data.pageindex,
        pagesize: res.data.data.pagesize
      })
    })
  },

  getList(pageindex, pagesize) {
    let that = this;
    //获取当前页和页面大小
    if (!pageindex && !pagesize) {
      pageindex = this.data.pageindex;
      pagesize = this.data.pagesize;
    }
    return new Promise(
      (resolve, reject) => {
        wx.request({
          url: app.config.getHostUrl() + '/api/pub/getList',
          header: {
            "Content-Type": "application/json"
          },
          data: {
            pageindex,
            pagesize
          },
          method: "POST",
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
    let that=this;
    let pageindex = that.data.pageindex;
    let pagesize = that.data.pagesize;
    this.getList(pageindex, pagesize ).then(res=>{
      if (res.data.data.activitys.length){
        res.data.data.activitys.forEach(e => {
          e.imgLink = "../listDetail/listDetail?acid=" + e.acid
        })
        that.setData({
          list: res.data.data.activitys,
          pageindex: res.data.data.pageindex,
          pagesize: res.data.data.pagesize
        }) 
      } else {
        Toast("没有更多了");
      }
    })
    .catch(res=>{
      console.log(res);
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

})