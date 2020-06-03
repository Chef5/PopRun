import Dialog from '@vant/weapp/dialog/dialog';

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
    signText: "报名",
    status: null,  //0活动未开始，1活动已结束，2已报名，3活动已完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    acid = options;
    this.getListDetail();
    this.getSignNum();
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    setTimeout(()=>{
      this.activityAlert()
    }, 500);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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
              status: 1,
              signText: "活动已结束!"
            })
          }else if (dateNow < dateStart) {
            that.setData({
              signDisabled: true,
              signType: "default",
              signIcon: "",
              status: 0,
              signText: "活动还未开始哦~"
            })
          }else {
            that.signSearch();
          }
          res.data.data.content = res.data.data.content != null ? res.data.data.content.split("<br>") : res.data.data.content;
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
  // 查询用户是否已报名/已完成
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
          if(res.data.data.isfinished == 1){
            that.setData({
              signDisabled: true,
              signIcon: "success",
              signText: "活动挑战完成",
              status: 3,
            })
            return;
          }else {
            that.setData({
              signDisabled: true,
              signIcon: "success",
              signText: "已报名",
              status: 2
            })
            return;
          }
        }
      }
    })
  },
  // 提示
  activityAlert() {
    if(this.data.status == null) return;
    let message = [
      '活动尚未开始，无法报名哦',
      '该活动已结束！',
      '您已报名，请尽快完成挑战哦',
      '恭喜您，挑战完成！'
    ];
    Dialog.alert({
      message: message[this.data.status],
    })
  }
})