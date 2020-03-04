// pages/moments/moments.js
const app = getApp();
// 滑动手势变量
var startX, endX, moveFlag = true;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowMenu: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let moments = that.data.moments;
        // if(!moments) moments = [];
        //下拉刷新
        moments = [];
        that.getMoments()
            .then((res)=>{
                console.log(res)
                if(res.data.data.moments.length != 0){
                    res.data.data.moments.forEach(element => {
                        moments.push(element);
                    });
                    that.setData({
                        moments: moments
                    })
                }
            })
            .catch((res)=>{
                console.log(res)
            })
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

    },

    /**
     * 获取动态
     */
    getMoments: function() {
        //获取当前页和页面大小，暂时省略
        let pageindex= 0, pagesize = 3;
        return new Promise(
            (resolve, reject) => {
                wx.request({
                    url: app.config.getHostUrl()+'/api/moments/getMoments',
                    method: 'post',
                    data:{
                        pageindex,pagesize
                    },
                    success: (res)=>{
                        if(res.statusCode == 200){
                            resolve(res);
                        }else{
                            // 服务器故障  标识：500
                            reject({error: 500, errMsg: "服务器故障", data: res});
                        }
                    },
                    fail: (res)=>{
                        // 请求错误
                        reject({error: 400, errMsg:"请求错误", data: res});
                    }
                })
            }
        )
    },

    // 跳转到新建页面
    openNewMoment: function() {
        console.log("打开新建动态页面");
        this.setData({
            isShowMenu: false
        });
        wx.navigateTo({
            url: './newMoment/newMoment',
            success: (result)=>{
                console.log("跳转到新建页面成功")
            },
            fail: ()=>{},
            complete: ()=>{}
        });
    },

    touchStart: function (e) {
        startX = e.touches[0].pageX; // 获取触摸时的原点
        moveFlag = true;
    },
    // 触摸移动事件
    touchMove: function (e) {
        endX = e.touches[0].pageX; // 获取触摸时的原点
        if (moveFlag) {
            if (startX - endX > 50) {
                console.log("move to left");
                this.setData({
                    isShowMenu: true
                })
                moveFlag = false;
            }
            // if (endX - startX > 50) {
            //     console.log("move to right");
            //     this.setData({
            //         isShowMenu: false
            //     })
            //     moveFlag = false;
            // }
        }
    },
    
    // 关闭侧滑菜单
    onMenuClose: function(){
        this.setData({
            isShowMenu: false
        })
    }
    
})