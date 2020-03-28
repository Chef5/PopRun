// pages/user/user.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {},  //用户数据
        medals: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        // 初始化用户数据
        let user = that.getUserInfoFromLocal();
        if(user){
            that.updateCurrentUser(user);//本地有数据
        }else{
            //从服务器获取：判断是否注册、本地缓存
            app.getOpenid().then(res=>{
                let openid = res;
                wx.request({
                    url: app.config.getHostUrl()+'/api/user/getUser',
                    method: 'post',
                    data: {
                      openid: openid
                    },
                    success: function(res){
                      if(res.statusCode == 200){
                        if(res.data.isSuccess){
                            that.updateCurrentUser(res.data.data);
                            wx.setStorageSync('user', JSON.stringify(res.data.data));
                        }else{
                            // 未注册情况
                        }
                      }else{
                        // 服务器故障
                      }
                    },
                    fail: function(res){
                      // 请求错误
                    }
                })
            })
        }
        // 获取勋章称号
        if(that.data.user){
            that.getUserAll(that.data.user.rid);
        }

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
     * 注册并获取用户信息
     */
    userReg: function(){
        app.getUserInfo();
        this.setData({
            userinfo: wx.getStorageSync('user')
        })
    },
    /**
     * 获取用户信息：在线获取，不依赖本地
     */
    getUserInfoOnline: function(){
        let that = this;
        app.getOpenid().then(
            (openid)=>{
                wx.request({
                    url: app.config.getHostUrl()+'/api/user/getUser',
                    method: 'post',
                    data: {
                        openid: openid
                    },
                    success: (res)=>{
                        that.setData({
                            userinfo: JSON.stringify(res.data)
                        });
                        wx.setStorageSync('user', JSON.stringify(res.data.data))
                    }
                })
            }
        ).catch(
            (err)=>{
                console.log(err)
            }
        )
    },

    // 从本地获取用户数据
    getUserInfoFromLocal: function () {
        let user = wx.getStorageSync('user');
        if(user){
            return JSON.parse(user);
        }else return false;
    },

    // 更新用户显示数据
    updateCurrentUser: function(data){
        if(data){
            this.setData({user: data});
        }
    },

    // 获取勋章称号等数据
    getUserAll: function(rid){
        let that = this;
        wx.request({
            url: app.config.getHostUrl()+'/api/user/getUserAll',
            method: 'post',
            data: {
              rid: rid
            },
            success: function(res){
              if(res.statusCode == 200){
                if(res.data.isSuccess){
                    that.setData({
                        medals_count: res.data.data.medals.length,
                        honors: res.data.data.honors instanceof Array ? res.data.data.honors[0] : res.data.data.honors,
                        medals: that.parseMedals(res.data.data.medals),
                    });
                }
              }else{
                // 服务器故障
              }
            },
            fail: function(res){
              // 请求错误
            }
        })
    },

    // 处理勋章数据
    parseMedals: function(medals){
        let nmedals = [];
        for(let i=0; i<medals.length; i++){
            if(medals[i] == undefined) continue;
            let outer = medals[i];
            let item = [outer]; //内循收集
            for(let n=i+1; n<medals.length; n++){
                if(outer.type == 0) break;
                if(medals[n] == undefined) continue;
                let inner = medals[n];
                if(outer.meid == inner.meid){
                    item.push(inner);
                    delete medals[n];  //用splice不行，因为n的最大值在循环开始就确定了
                }
            }
            nmedals.push(item);
        }
        return nmedals;
    }

})