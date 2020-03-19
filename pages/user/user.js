// pages/user/user.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {},  //用户数据
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
    }

})