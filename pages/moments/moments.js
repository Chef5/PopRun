// pages/moments/moments.js
import Notify from '@vant/weapp/notify/notify';
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';

const app = getApp();
// 滑动手势变量
var startX, endX; // moveFlag will be initialized in onLoad
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowMenu: false,    //侧滑菜单
        isShowMessages: false,//消息盒子
        isShowloading: false,
        isShowHot: false,
        moments: [],
        pageindex: 0,
        pagesize: 10,
        unreadMessagesNum: 0, //未读信息
        setting: {
            power: true,
            voice: true,
            shake: true,
            screen: true,
            method: '1'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.moveFlag = true; // Initialize moveFlag here
        let that = this;
        this.refreshMoments();
        this.setData({
            unreadMessagesNum: app.globalData.status.tabbar[1].number
        })
        let setting = wx.getStorageSync('setting');
        if(setting){
            this.setData({ setting })
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        app.updateNotices({read: 0, type: undefined}).then(({moment})=>{
            this.setData({
                unreadMessagesNum: moment  
            })
        })
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
            .catch((err)=>{ // Changed res to err for clarity
                console.error("onReachBottom error:", err);
                Toast.fail('加载更多失败');
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
        //获取当前页和页面大小 !!0 = false
        if(!pageindex && !pagesize && pageindex!=0){
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
                        Toast.fail('加载动态失败，请稍后重试');
                        reject({error: 400, errMsg: res.errMsg || "请求错误", data: res});
                    }
                })
            }
        )
    },

    // 刷新动态
    refreshMoments: function() {
        let that = this;
        let pagesize = this.data.pagesize;
        // that.setData({ moments: [] }); // Clear moments for refresh, or handle updates more gracefully

        // Promise.all simplifies handling multiple async operations
        Promise.all([
            that.getMoments(0, pagesize), // Fetch initial moments
            that.fetchHotMomentData()      // Fetch hot moment data
        ]).then(([momentsRes, hotMomentRes]) => {
            if (momentsRes.data.isSuccess) {
                Notify({ type: 'success', message: momentsRes.data.msg || '动态加载成功' });
                let initialMoments = momentsRes.data.data.moments;
                let finalMoments = initialMoments;
                let hotMomentDataToShow = null;
                let showHotFlag = false;

                if (hotMomentRes && hotMomentRes.isSuccess && hotMomentRes.data) {
                    // Filter out the hot moment from the initial list if it exists
                    finalMoments = initialMoments.filter(moment => moment.moid !== hotMomentRes.data.moid);
                    hotMomentDataToShow = hotMomentRes.data;
                    showHotFlag = true;
                } else if (hotMomentRes && !hotMomentRes.isSuccess) {
                    // Hot moment fetch failed, but moments might be okay
                    // Notify({ type: 'warning', message: hotMomentRes.msg || '热门推荐加载失败' });
                    // console.warn("Hot moment fetch failed:", hotMomentRes.msg);
                }
                // else hotMomentRes is null (e.g. network error in fetchHotMomentData)

                that.setData({
                    moments: finalMoments,
                    hotMoment: hotMomentDataToShow,
                    isShowHot: showHotFlag,
                    pageindex: momentsRes.data.data.pageindex,
                    pagesize: momentsRes.data.data.pagesize,
                });
            } else {
                Notify({ type: 'danger', message: momentsRes.data.msg || '动态加载失败' });
            }
        }).catch(error => {
            console.error("Error in refreshMoments (Promise.all):", error);
            if (error && error.errMsg) { // Catch errors from getMoments or fetchHotMomentData
                 Notify({ type: 'danger', message: error.errMsg });
            } else {
                 Notify({ type: 'danger', message: '刷新失败，请稍后重试' });
            }
        }).finally(() => {
            app.stopRefresh(); // Stop pull-down refresh animation
        });
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
        this.moveFlag = true; // Use this.moveFlag
    },
    // 触摸移动事件
    touchMove: function (e) {
        endX = e.touches[0].pageX; // 获取触摸时的原点
        if (this.moveFlag) { // Use this.moveFlag
            if (startX - endX > 200) {
                console.log("move to left");
                this.setData({
                    isShowMenu: true
                });
                this.moveFlag = false; // Use this.moveFlag
            }
            // if (endX - startX > 50) {
            //     console.log("move to right");
            //     this.setData({
            //         isShowMenu: false
            //     })
            //     this.moveFlag = false; // Use this.moveFlag
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
            if(user.constructor != Object) user = JSON.parse(user);
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
        Dialog.confirm({
            title: '提示',
            message: '删除后，将无法恢复哦！'
        }).then(() => {
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
                        let currentMoments = that.data.moments;
                        const moidToDelete = e.detail.moid;
                        const updatedMoments = currentMoments.filter(moment => moment.moid !== moidToDelete);
                        that.setData({
                            moments: updatedMoments
                        });
                        Toast.success('删除成功');
                    }else{
                        Notify({ type: 'danger', message: res.data.msg || '删除失败' });
                    }                                                                       
                },
                fail: (err)=>{ // Changed res to err
                    console.error("Delete moment request failed:", err);
                    Notify({ type: 'danger', message: err.errMsg || '删除请求失败' });
                }
            })
        }).catch(() => {
        // on cancel - user clicked cancel on the dialog
        });
    },

    // Fetches hot moment data - refactored from getHot
    fetchHotMomentData: function() {
        let that = this;
        return new Promise((resolve, reject) => {
            wx.request({
                url: app.config.getHostUrl() + '/api/moments/getHot',
                method: 'get',
                success: (res) => {
                    if (res.statusCode == 200) {
                        if (res.data.isSuccess) {
                            resolve({ isSuccess: true, data: res.data.data, msg: res.data.msg });
                        } else {
                            resolve({ isSuccess: false, msg: res.data.msg || "获取热门推荐失败" }); // Resolve with success:false
                        }
                    } else {
                        // 服务器故障
                        console.error("fetchHotMomentData server error:", res);
                        reject({ error: 500, errMsg: "服务器故障", data: res }); // Reject on server error
                    }
                },
                fail: (err) => {
                    console.error("fetchHotMomentData request failed:", err);
                    Toast.fail('热门推荐加载失败');
                    reject({ error: 400, errMsg: err.errMsg || "热门推荐请求失败", data: err }); // Reject on request fail
                }
            });
        });
    }
    // Original getHot function is removed as its logic is now part of refreshMoments and fetchHotMomentData
})