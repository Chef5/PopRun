// pages/moments/moments.js
import Notify from '@vant/weapp/notify/notify';
import Toast from '@vant/weapp/toast/toast';

const app = getApp();
// 滑动手势变量
var startX, endX, moveFlag = true;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowMenu: false,    //侧滑菜单
        isShowMessages: false,//消息盒子
        isShowloading: false,
        moments: [],
        pageindex: 0,
        pagesize: 10,
        unreadMessagesNum: 0, //未读信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        this.refreshMoments();
        this.setData({
            unreadMessagesNum: app.globalData.status.tabbar[1].number
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.refreshMoments();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let moments = that.data.moments;
        let pageindex = that.data.pageindex;
        let pagesize = that.data.pagesize;

        that.getMoments(pageindex, pagesize)
            .then((res)=>{
                console.log(res)
                if(res.data.data.moments.length != 0){
                    res.data.data.moments.forEach(element => {
                        moments.push(element);
                    });
                    that.setData({ 
                        moments,
                        pageindex: res.data.data.pageindex,
                        pagesize : res.data.data.pagesize
                    });
                }else{
                    Toast('没有更多了');
                }
            })
            .catch((res)=>{
                console.log(res);
            })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 获取动态
     */
    getMoments: function(pageindex, pagesize) {
        let that = this;
        that.setData({
            isShowloading: true
        });
        //获取当前页和页面大小
        if(!pageindex && !pagesize){
            pageindex = this.data.pageindex;
            pagesize = this.data.pagesize;
        }
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
                        that.setData({
                            isShowloading: false
                        });
                    },
                    fail: (res)=>{
                        // 请求错误
                        that.setData({
                            isShowloading: false
                        });
                        reject({error: 400, errMsg:"请求错误", data: res});
                    }
                })
            }
        )
    },

    // 刷新动态
    refreshMoments: function(){
        let that = this, pagesize = this.data.pagesize;
        that.setData({ moments:[] });  // 需要清空，不然不更新？why
        that.getMoments(0, pagesize)
            .then((res)=>{
                console.log(res)
                if(res.data.isSuccess){
                    Notify({ type: 'success', message: res.data.msg });
                    that.setData({ 
                        moments: res.data.data.moments,
                        pageindex: res.data.data.pageindex,
                        pagesize : res.data.data.pagesize
                    });
                }else{
                    Notify({ type: 'danger', message: res.data.msg });
                }
                app.stopRefresh();  //停止刷新状态的显示
            })
            .catch((res)=>{
                console.log(res)
            })
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
            if (startX - endX > 200) {
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

    // 开启侧滑菜单
    openMenu: function (){
        this.setData({
            isShowMenu: true
        })
    },

    // 开启消息盒子
    openMessage: function (){
        // this.setData({
        //     isShowMessages: true
        // })
        let user = wx.getStorageSync('user');
        if(user){
            user = JSON.parse(user);
            wx.navigateTo({
                url: 'messages/messages?rid='+user.rid+'&type=moment',
                fail: ()=>{},
                complete: ()=>{}
            });
        }
    },
    
    // 关闭侧滑菜单和消息盒子
    onMenuClose: function(){
        this.setData({
            isShowMenu: false,
            isShowMessages: false
        })
    },

    // 删除动态
    doDeleteMoment: function(e){
        let that = this;
        let user = app.getUser();
        if(!user){
            user = wx.getStorageSync('user');
            if(!user) return;
        }
        wx.request({
            url: app.config.getHostUrl()+'/api/moments/delMoment',
            method: 'post',
            data: {
               "rid": user.rid,
               "moid": e.detail.moid
            },
            success: (res)=>{
                if(res.data.isSuccess){
                    // let moments  = that.data.moments;  //这样删了，页面为何不生效
                    // moments.splice(moments.findIndex(item=>item.moid==e.detail.moid),1);
                    that.refreshMoments();
                }else{
                    Notify({ type: 'danger', message: res.data.msg });
                }                                                                       
            },
            fail: (res)=>{
              console.log(res);
            }
        })
    }

})