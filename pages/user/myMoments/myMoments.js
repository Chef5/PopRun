
import Toast from '@vant/weapp/toast/toast';
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowloading: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        this.eventChannel = this.getOpenerEventChannel();
        this.eventChannel.on('getDataFromUserPage', function(data) {
            that.setData({ user: data });
            that.initMoment();
        })
    },

    
    // 初始化动态
    initMoment() {
        let moments = [], that = this;
        that.getMoments(0, 5)
            .then((res)=>{
                console.log(res)
                if(res.data.data.moments.length != 0){
                    res.data.data.moments.forEach(element => {
                        moments.push(element);
                    });
                    that.setData({ 
                        moments,
                        pageindex: res.data.data.pageindex,
                        pagesize : res.data.data.pagesize,
                        isShowloading: false
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
        let rid = that.data.user.rid;
        that.requestUserRunData(rid);
        that.requestUserData(rid).then((res)=>{
            that.setData({ user: res });
            app.stopRefresh();
            Notify({ type: 'success', message: '刷新成功' });
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

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
        let rid = that.data.user.rid;
        return new Promise(
            (resolve, reject) => {
                wx.request({
                    url: app.config.getHostUrl()+'/api/moments/getMine',
                    method: 'post',
                    data:{
                        rid,
                        pageindex,
                        pagesize
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