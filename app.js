//app.js
import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';
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
  /*******************************
   * 公共方法区
   *******************************/
  /**
   * 设置tabbar状态
   */
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
  },

  /**
   * 获取基础配置
   */
  config: {
    //获取请求环境
    getHostUrl: function(){
      let hosturl = "http://127.0.0.1:8000"; //后端本地
      // let hosturl = "http://dev.run.nunet.cn";  //开发环境
      // let hosturl = "http://run.nunet.cn";   //线上环境
      return hosturl;
    }
  },

  /**
   * 微信获取用户openid
   */
  getOpenid: function(){
    let that = this;
    return new Promise(
      (resolve, reject) => {
        wx.login({
          success (res) {
            if (res.code) {
              wx.request({
                url: that.config.getHostUrl()+'/api/main/getOpenid',
                method: 'post',
                data: {
                  code: res.code
                },
                success: function(res){
                  if(res.statusCode == 200){
                    resolve(res.data.data.openid);
                  }else{
                    // 服务器故障  标识：500
                    reject({error: 500, errMsg: "服务器故障", data: res});
                  }
                },
                fail: function(res){
                  // 请求错误
                  reject({error: 400, errMsg:"请求错误", data: res});
                }
              })
            } else {
              // 登录失败
              reject({error: 400, errMsg:res.errMsg, data: res});
            }
          }
        })
      }
    );
  },
  /**
   * 微信授权注册
   */
  getUserInfo: function(){
    let that = this;
    //前提需要通过open-type="getUserInfo"按钮进行用户信息授权
    wx.getSetting({
      complete: (res) => {
        if(res.authSetting['scope.userInfo']){ //如果授权过了，获取用户信息
          wx.getUserInfo({
            complete: (res) => {
              that.getOpenid().then(  //获取openid，不需要授权
                (data) => {
                  let userData = {
                    openid: data,   //openid
                    nickname: res.userInfo.nickName,  //昵称
                    sex: res.userInfo.gender,  //头像
                    img: res.userInfo.avatarUrl  //性别
                  };
                  //跑鸭注册
                  wx.request({
                    url: that.config.getHostUrl()+'/api/main/wxAuth',
                    method: 'post',
                    data: userData,
                    success: (res) => {
                      if(res.data.isSuccess){
                        //注册成功处理逻辑
                        console.log(res.data)
                        //用户信息本地缓存
                        wx.setStorageSync('user', JSON.stringify(res.data.data));
                      }else{
                        // 注册失败
                        console.log(res.data.msg)
                      }
                    },
                    fail: (res) => {
                      // 请求失败
                    }
                  })
                }
              ).catch(
                (data) => {
                  // 错误处理 data: {error, errMsg, data}
                  console.log(data)
                }
              )
            },
          })
        }else{
            //用户未授权，提示框用户授权
        }
      },
    })
  },

  /** 
   * 获取当前用户数据、判断是否注册
  */
  getUser: function(){
    let that = this;
    let user = wx.getStorageSync('user');
    if(user){
      user = JSON.parse(user);
      return user;
    }else{
      // 判断是否注册
      that.getOpenid().then(
        (openid)=>{
            wx.request({
                url: that.config.getHostUrl()+'/api/user/getUser',
                method: 'post',
                data: {
                    openid: openid
                },
                success: (res)=>{
                    if(res.data.data != null){ //已注册，未登录
                      Dialog.confirm({
                        title: '提示',
                        message: '当前操作需要登录才能进行，请登录'
                      }).then(() => {
                        Notify({ type: 'success', message: res.data.msg });
                        wx.setStorageSync('user', JSON.stringify(res.data.data));
                        user = res.data.data;
                      }).catch(() => {
                        //点击取消，啥也不干
                        Notify({ type: 'warning', message: "取消登录" });
                      });
                    }else{ //未注册
                      Dialog.confirm({
                        title: '提示',
                        message: '您还未授权注册，是否立即授权注册？'
                      }).then(() => {
                        that.getUserInfo();
                      }).catch(() => {
                        //点击取消，啥也不干
                        Notify({ type: 'warning', message: "取消注册" });
                      });
                    }
                }
            })
        }
      ).catch(
          (err)=>{
              console.log(err);
              Dialog.alert({
                title: '提示',
                message: err,

              }).then(() => {
                // on close
              });
          }
      )
      return user;
    }
  },

  /**  
   * 作用：检测用户是否注册，阻止未注册用户进行某些事件交互
   * 需要：在页面加 <van-dialog id="van-dialog" />
   * 不传user时: 会先获得openid，然后在线判断是否注册
   */
  checkUser: function(user){
    let that = this;
    if(!user){
      that.showNoticToTraveler();
      return false;
    }else{
      that.getOpenid().then(res => {
        let openid = res;
        wx.request({
          url: that.config.getHostUrl() + '/api/user/getUser',
          method: 'post',
          data: {
            openid: openid
          },
          success: function (res) {
            if (res.statusCode == 200) {
              if (res.data.isSuccess) {
                wx.setStorageSync('user', JSON.stringify(res.data.data));
              } else {
                // 未注册情况
                that.showNoticToTraveler();
              }
            } else {
              // 服务器故障
            }
          },
          fail: function (res) {
            // 请求错误
          }
        })
      })
    }
  },

  // 未注册提示
  showNoticToTraveler: function(){
    Dialog.alert({
      title: '提示',
      message: '您还未注册，为了保障你的良好体验，请在个人中心点击授权注册'
    });
  }

})