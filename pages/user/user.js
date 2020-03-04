// pages/user/user.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})