//app.js
App({
  onLaunch: function () {
    var that = this;
    //初始化tabbar状态
    this.globalData.status.tabbar.forEach(function(item,index){
      that.setTabbar(index, item)
    })
  },
  globalData: {
    status: {
      tabbar: [
        {
          dot: false,
          number: 0
        },
        {
          dot: true,
          number: 12
        },
        {
          dot: true,
          number: 0
        },
        {
          dot: true,
          number: 2
        }
      ]
    }
  },
  /**
   * 公共方法区
   */
  //1.设置tabbar状态
  setTabbar: function(index, value){
    if(value.number==0 || value.number==null || value.number==undefined){//取消数字，设置红点
      wx.removeTabBarBadge({
        index: index,
      })
      if(value.dot){
        wx.showTabBarRedDot({
          index: index,
        })
      }else{
        wx.hideTabBarRedDot({
          index: index,
        })
      }
    }else{  //设置数字
      wx.setTabBarBadge({
        index: index,
        text: value.number+'',
      })
    }
  }
})