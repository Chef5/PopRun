const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        if(options.type == 'moment'){  //从动态圈子过来
            app.getNotices(options.rid).then((res)=>{
                let messages = [];
                let count = 0;
                for(let i=0; i<res.length; i++){
                    if(res[i].type !=0){
                        messages.push(res[i]);
                        if( res[i].read==0 ) count++;
                    }
                }
                that.setData({ messages });
                if(count>0){
                    wx.setNavigationBarTitle({
                        title: '消息通知 '+count,
                    });
                }
            })
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