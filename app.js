//app.js
import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';
import { hostUrl, appInfo } from './config';
App({
  onLaunch: function () {
    let that = this;
    //初始化tabbar状态
    that.updateNotices({read: 0, type: undefined});
  },
  globalData: {
    status: {
      tabbar: [
        {
          dot: false,
          number: 0
        },
        {
          dot: false,
          number: 0
        },
        {
          dot: false,
          number: 0
        },
        {
          dot: false,
          number: 0
        }
      ]
    }
  },
  /*******************************
   * 公共方法区
   *******************************/
  /**
   * 设置tabbar状态
   * index: 第几个tab，0~3
   * value: { dot:boolean, number:number }
   */
  setTabbar: function(index, value){
    if (value.number && value.number > 0) {
      wx.setTabBarBadge({
        index: index,
        text: value.number + '',
      });
      // If number is shown, typically red dot is not separately shown
      wx.hideTabBarRedDot({
        index: index,
      });
    } else {
      wx.removeTabBarBadge({
        index: index,
      });
      if (value.dot) {
        wx.showTabBarRedDot({
          index: index,
        });
      } else {
        wx.hideTabBarRedDot({
          index: index,
        });
      }
    }
  },

  /**
   * 获取基础配置
   */
  config: {
    //获取请求环境
    getHostUrl: function(){
      return hostUrl;
    }
  },

  /**
   * 微信获取用户openid
   */
  getOpenid: function(){
    let that = this;
    return new Promise(
      (resolve, reject) => {
        const openid = wx.getStorageSync('openid');
        if (openid && openid.length > 10) {
          resolve(openid); // 本地有openid缓存，直接返回
        }
        const isMyHost = !/nunet\.cn/.test(hostUrl);
        if (!isMyHost) {
          if (!appInfo.appid || !appInfo.secret) {
            throw new Error('请在 config.js 中配置自己的appid和secret');
          }
        }
        const api = !isMyHost
          ? `/api/main/getOpenid?appid=${appInfo.appid}&secret=${appInfo.secret}`
          : '/api/main/getOpenid';
        wx.login({
          success (res) {
            if (res.code) {
              wx.request({
                url: that.config.getHostUrl()+api,
                method: 'post',
                data: {
                  code: res.code
                },
                success: function(res){
                  if(res.statusCode == 200 && res.data.isSuccess){
                    resolve(res.data.data.openid);
                    wx.setStorageSync('openid', res.data.data.openid); // 缓存openid
                  }else{
                    // 服务器故障  标识：500
                    reject({error: 500, errMsg: res.data.msg || "服务器故障", data: res});
                  }
                },
                fail: function(res){
                  // 请求错误
                  reject({error: 400, errMsg: res.errMsg || "请求错误", data: res});
                }
              })
            } else {
              // 登录失败
              reject({error: 400, errMsg: res.errMsg || "微信登录失败", data: res});
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
                        console.log(res.data);
                        //用户信息本地缓存
                        wx.setStorageSync('user', JSON.stringify(res.data.data));
                        wx.showToast({
                          title: '注册成功',
                          icon: 'success'
                        });
                      }else{
                        // 注册失败
                        console.error("微信授权注册失败:", res.data.msg);
                        wx.showToast({
                          title: res.data.msg || '注册失败',
                          icon: 'none'
                        });
                      }
                    },
                    fail: (err) => {
                      // 请求失败
                      console.error("微信授权请求失败:", err);
                      wx.showToast({
                        title: '授权请求失败',
                        icon: 'none'
                      });
                    }
                  })
                }
              ).catch(
                (err) => {
                  // 错误处理 data: {error, errMsg, data}
                  console.error("getOpenid 失败:", err);
                  wx.showToast({
                    title: err.errMsg || '获取用户信息失败',
                    icon: 'none'
                  });
                }
              )
            },
            fail: (err) => {
              console.error("wx.getUserInfo 失败:", err);
              wx.showToast({
                title: '获取微信用户信息失败',
                icon: 'none'
              });
            }
          })
        }else{
            //用户未授权，提示框用户授权
            wx.showModal({
              title: '授权提示',
              content: '您尚未授权获取用户信息，这将影响部分功能的使用。请在设置中开启授权。',
              showCancel: false
            });
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
      if(user.constructor != Object) user = JSON.parse(user);
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
                      wx.showModal({
                        title: '提示',
                        content: '当前操作需要登录才能进行，请登录',
                        success (r) {
                          if (r.confirm) {
                            wx.showToast({
                              title: '登录成功',
                              icon: 'success',
                            });
                            wx.setStorageSync('user', JSON.stringify(res.data.data));
                            // Note: Assigning to 'user' here updates the local callback variable.
                            // The outer 'user' variable won't be updated for the synchronous return.
                            // This function ideally should return a Promise for proper async handling.
                            user = res.data.data; 
                          } else if (r.cancel) {
                            //点击取消，啥也不干
                            wx.showToast({
                              title: '取消登录',
                              icon: 'none', // 'error' icon is not standard, use 'none' or 'success'
                            })
                          }
                        }
                      })
                    }else{ //未注册
                      wx.showModal({
                        title: '提示',
                        content: '您还未授权注册，是否立即授权注册？',
                        success (modalRes) { // Renamed 'res' to 'modalRes' to avoid conflict
                          if (modalRes.confirm) {
                            that.getUserInfo();
                          } else if (modalRes.cancel) {
                            //点击取消，啥也不干
                            wx.showToast({
                              title: '取消注册',
                              icon: 'none', // 'error' icon is not standard
                            })
                          }
                        }
                      })
                    }
                },
                fail: (err) => { // Added fail callback for /api/user/getUser request
                    console.error("获取用户数据请求失败:", err);
                    wx.showToast({
                        title: '获取用户信息失败',
                        icon: 'none'
                    });
                }
            })
        }
      ).catch(
          (err)=>{
              console.error("getOpenid in getUser failed:", err);
              wx.showToast({
                title: err.errMsg || '获取用户信息失败',
                icon: 'none',
              })
          }
      )
      return user; // This returns the user synchronously, potentially before async operations complete.
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
              console.error("checkUser - 服务器故障:", res);
              wx.showToast({ title: '服务暂不可用', icon: 'none' });
            }
          },
          fail: function (err) {
            // 请求错误
            console.error("checkUser - 请求错误:", err);
            wx.showToast({ title: '网络请求失败', icon: 'none' });
          }
        })
      }).catch(err => {
        console.error("checkUser - getOpenid failed:", err);
        wx.showToast({ title: err.errMsg || '获取用户信息失败', icon: 'none' });
      })
    }
  },

  // 未注册提示
  showNoticToTraveler: function(){
    wx.showModal({
      title: '提示',
      content: '您还未注册，为了保障你的良好体验，请在个人中心点击授权注册',
      showCancel: false,
    })
  },

  /**  
   * 结束下拉刷新：当使用了下拉刷新，请求结束时调用
  */
  stopRefresh: function(){
    //停止刷新
    wx.stopPullDownRefresh();
    // 隐藏顶部刷新图标
    wx.hideNavigationBarLoading();
  },

  /**  
   * 获取通知
   * type: 1点赞，2评论，0系统通知
   * read: 0未读，1已读
   */
  getNotices: function(rid, read, type){
    // if(!rid) return false; // Returning false from a promise-returning function is an anti-pattern
    if(!rid) {
      return Promise.reject("请求用户ID (rid) 不能为空");
    }
    let data = { rid };
    if(type === 0 || type) data.type = type; // Use === for strict equality if type can be 0
    if(read === 0 || read) data.read = read; // Use === for strict equality if read can be 0
    return new Promise((resolve, reject)=>{
      wx.request({
        url: this.config.getHostUrl()+'/api/main/getNotice',
        data: data,
        method: 'POST',
        success: (result)=>{
          if(result.data.isSuccess){
            resolve(result.data.data)
          }else{
            reject(result.data.msg || "获取通知失败")
          }
        },
        fail: (err)=>{
            console.error("getNotices request failed:", err);
            reject(err.errMsg || "获取通知请求失败");
        },
        complete: ()=>{}
      });
    })
  },
  // 更新通知
  updateNotices: function({read, type}){
    let that = this;
    return new Promise((resolved, rejected)=>{
      let user = wx.getStorageSync('user');
      if(user){
        if(user.constructor != Object) user = JSON.parse(user);
        let setting = wx.getStorageSync('setting');
        if(!setting){
          setting = {
            power: true,
            voice: true,
            shake: true,
            screen: true,
            method: '1'
          };
          wx.setStorageSync('setting', setting);
        }
        that.getNotices(user.rid, read, type).then((res)=>{
          let moment = 0, system = 0;
          let tabbar = that.globalData.status.tabbar;
          for(let i=0; i<res.length; i++){
              if(res[i].type !=0 && res[i].read==0 ) moment++;
              if(res[i].type ==0 && res[i].read==0 ) system++;
          }
          if(setting.method != '2'){  //非免打扰
            if(setting.method == '1'){  //数字提示
              tabbar[1] = { dot: false, number: moment}; //动态圈子
              tabbar[3] = { dot: false, number: system}; //个人中心
            }else if(setting.method == '0'){ //红点
              tabbar[1] = { dot: true }; //动态圈子
              tabbar[3] = { dot: true }; //动态圈子
            }
            if(type == 0){
              that.setTabbar(3, tabbar[3]);  //设置个人中心tabbar数字
            }else {  //全部设置tabbar数字
              that.setTabbar(1, tabbar[1]);
              that.setTabbar(3, tabbar[3]);
            }
          }else{ //免打扰
            that.setTabbar(1, { dot: false });
            that.setTabbar(3, { dot: false });
          }
          // that.globalData.status.tabbar.forEach(function(item,index){
          //   that.setTabbar(index, item)
          // })
          resolved({moment, system});  //返回数据页面内使用
        }).catch(errMsg => {
          console.error("updateNotices - getNotices failed:", errMsg);
          // Optionally show a toast or handle the error for the user
          // wx.showToast({ title: '更新通知失败', icon: 'none' });
          rejected(errMsg); // Propagate the rejection
        })
      } else {
        rejected("用户未登录"); // Or handle this case as appropriate
      }
    })
  },
  // 阅读消息
  doRead(noids) {
    if(!noids) return;
    if(!(noids instanceof Array)){
        noids = [ noids ];
    }
    return new Promise((resolve, reject)=>{
        wx.request({
            url: this.config.getHostUrl()+'/api/main/readNotice',
            data: { noids },
            method: 'POST',
            success: (result)=>{
                if(result.data.isSuccess){
                    resolve(result.data) // Usually resolve with result.data or result.data.data
                }else{
                    reject(result.data.msg)
                }
            },
            fail: (err)=>{ // Added error handling for fail callback
                console.error("doRead request failed:", err);
                reject(err.errMsg || "阅读消息请求失败");
            },
            complete: ()=>{}
        });
    })
  },
  // 删除消息
  doDelete(noids) {
    if(!noids) return;
    if(!(noids instanceof Array)){
        noids = [ noids ];
    }
    return new Promise((resolve, reject)=>{
        wx.request({
            url: this.config.getHostUrl()+'/api/main/delNotice',
            data: { noids },
            method: 'POST',
            success: (result)=>{
                if(result.data.isSuccess){
                    resolve(result.data) // Usually resolve with result.data or result.data.data
                }else{
                    reject(result.data.msg)
                }
            },
            fail: (err)=>{ // Added error handling for fail callback
                console.error("doDelete request failed:", err);
                reject(err.errMsg || "删除消息请求失败");
            },
            complete: ()=>{}
        });
    })
  },

  /**
   * 查看他人个人中心
   */
  goToUserPage: function(rid){
    wx.navigateTo({
      url: '/pages/user/userPage/userPage?rid='+rid
    });
  }

})