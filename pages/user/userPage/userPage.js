import Notify from '@vant/weapp/notify/notify';
import Toast from '@vant/weapp/toast/toast';
const format = require("../../../utils/util");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowloading: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        if(options.rid){ //从其他入口查看
            this.requestUserData(options.rid).then((res)=>{
                res.medals = that.parseMedals(res.medals);
                that.setData({ user: res });
                that.initData(options.rid);
                that.parseSex(res.sex);
            })
        }else{  //从个人中心预览自己
            this.eventChannel = this.getOpenerEventChannel();
            this.eventChannel.on('getDataFromUserPage', function(data) {
                that.setData({ user: data });
                that.initData(data.rid);
                that.parseSex(data.sex);
            })
        }

        //获取动态
    },

    initData(rid){
        this.requestUserRunData(rid);
        this.requestUserPrivacy(rid);
        this.initMoment();
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

    //获取用户数据
    requestUserData (rid) {
        return new Promise((resolve, reject)=>{
            wx.request({
                url: app.config.getHostUrl() + '/api/user/getUserAll',
                data: { rid },
                header: {'content-type':'application/json'},
                method: 'post',
                success: (result)=>{
                    if(result.data.isSuccess){
                        resolve(result.data.data);
                    }else{
                        reject(result.data.msg);
                    }
                },
                fail: ()=>{
                    reject('网络错误！');
                },
                complete: ()=>{}
            });
        })
    },

    //获取用户运动数据
    requestUserRunData (rid) {
        let that = this;
        wx.request({
            url: app.config.getHostUrl() + '/api/user/getMyRunsData',
            data: { rid },
            header: {'content-type':'application/json'},
            method: 'GET',
            success: (result)=>{
                if(result.data.isSuccess){
                    let runs = result.data.data;
                    runs.avgS = format.formatSpeed(runs.avgS);
                    that.setData({
                        runs
                    })
                }
            },
            fail: ()=>{},
            complete: ()=>{}
        });
    },

    //获取用户隐私设置
    requestUserPrivacy (rid) {
        let that = this;
        wx.request({
            url: app.config.getHostUrl() + '/api/user/getProvicy',
            data: { rid },
            header: {'content-type':'application/json'},
            method: 'GET',
            success: (result)=>{
                if(result.data.isSuccess){
                    that.setData({
                        privacy: result.data.data,
                        isShowloading: false
                    })
                }
            },
            fail: ()=>{},
            complete: ()=>{}
        });
    },

    // 处理勋章数据
    parseMedals: function (medals) {
        if(medals == []) return medals;
        let nmedals = [];
        for (let i = 0; i < medals.length; i++) {
        if (medals[i] == undefined) continue;
        let outer = medals[i];
        let item = [outer]; //内循收集
        for (let n = i + 1; n < medals.length; n++) {
            if (outer.type == 0) break;
            if (medals[n] == undefined) continue;
            let inner = medals[n];
            if (outer.meid == inner.meid) {
            item.push(inner);
            delete medals[n];  //用splice不行，因为n的最大值在循环开始就确定了
            }
        }
        nmedals.push(item);
        }
        return nmedals;
    },

    //处理用户性别
    parseSex(sex) {
        let ta = null;
        if(sex==0){
            ta = "Ta";
        }else if(sex==1){
            ta = "他";
        }else{
            ta = "她";
        }
        this.setData({ ta });
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