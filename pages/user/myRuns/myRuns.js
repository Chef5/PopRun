
import Notify from '@vant/weapp/notify/notify';
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';

const app = getApp();
const format = require("../../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowloading: true,
        runData: {},  //统计数据
        runs: [],     //运动列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let user = app.getUser();
        this.setData({ user });
        this.setData({ rid: options.rid })
        this.initData(options.rid);
    },

    //初始化数据
    initData (rid) {
        let that = this;
        this.setData({ isShowloading: true })
        this.requestUserRunData(rid);
        this.getMyRuns(0, 10).then( res => {
            that.setData({
                runs: res.data.data.runs,
                pageindex: res.data.data.pageindex,
                pagesize : res.data.data.pagesize,
                isShowloading: false
            })
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
        let rid = that.data.rid;
        this.setData({ isShowloading: true })
        that.requestUserRunData(rid);
        that.getMyRuns(0, 10).then( res => {
            that.setData({ 
                runs: res.data.data.runs,
                pageindex: res.data.data.pageindex,
                pagesize : res.data.data.pagesize,
                isShowloading: false
            });
            app.stopRefresh();
            Notify({ type: 'success', message: '刷新成功' });
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let runs = that.data.runs;
        let pageindex = that.data.pageindex;
        let pagesize = that.data.pagesize;

        that.getMyRuns(pageindex, pagesize)
            .then((res)=>{
                console.log(res)
                if(res.data.data.runs.length > 0){
                    // res.data.data.runs.forEach(element => {
                    //     runs.push(element);
                    // });
                    that.setData({ 
                        runs: runs.concat(res.data.data.runs),
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
     * 获取用户运动数据
     */
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
                        runData: runs
                    })
                }
            },
            fail: ()=>{},
            complete: ()=>{}
        });
    },

    /** 
     * 获取用户运动列表
     */
    getMyRuns: function(pageindex, pagesize) {
        let that = this;
        //获取当前页和页面大小
        if(!pageindex && !pagesize){
            pageindex = that.data.pageindex;
            pagesize = that.data.pagesize;
        }
        let rid = that.data.rid;
        return new Promise(
            (resolve, reject) => {
                wx.request({
                    url: app.config.getHostUrl()+'/api/user/getMyRuns',
                    method: 'get',
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
                    },
                    fail: (res)=>{
                        // 请求错误
                        reject({error: 400, errMsg:"请求错误", data: res});
                    }
                })
            }
        )
    },

    /**
     * 删除记录
     */
    doDelete(run) {
        let that = this;
        Dialog.confirm({
            title: '提示',
            message: '删除后将无法恢复，请慎重操作',
            confirmButtonText: '确认删除',
            zIndex: 1000
        }).then(() => {
            wx.request({
                url: app.config.getHostUrl() + '/api/run/delRun',
                method: 'post',
                data: {
                ruid: run.detail.ruid,
                rid: run.detail.rid
                },
                success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.isSuccess) {
                    
                    } else {
                        Dialog.alert({
                            message: res.data.msg
                        }).then(() => {
                        // on close
                        });
                    }
                } else {
                    Dialog.alert({
                        message: "服务器错误"
                    }).then(() => {
                    // on close
                    });
                }
                },
                fail: function (res) {
                    Dialog.alert({
                        message: "网络错误"
                    }).then(() => {
                    // on close
                    });
                },
                complete: function (){
                    //删除后更新页面
                    that.setData({
                        isShowDetail: false
                    })
                    that.setData({ isShowloading: true })
                    that.requestUserRunData(run.detail.rid);
                    that.getMyRuns(0, 10).then( res => {
                        that.setData({ 
                            runs: res.data.data.runs,
                            pageindex: res.data.data.pageindex,
                            pagesize : res.data.data.pagesize,
                            isShowloading: false
                        });
                        app.stopRefresh();
                        Notify({ type: 'success', message: '刷新成功' });
                    })
                }
            })
        }).catch(() => {
        // on cancel
        });
    },

    
    // 分享
    doShare(e) {
        // 提示已分享
        if(e.detail.isshared == 1){
            Dialog.alert({
                message: '你已分享过了'
            }).then(() => {
            // on close
            });
        }

    },

})