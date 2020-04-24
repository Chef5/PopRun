
import Notify from '@vant/weapp/notify/notify';
import Toast from '@vant/weapp/toast/toast';

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowloading: true,
        runData: {},  //统计数据
        runs: [{
            "ruid": 6,
            "rid": 6,
            "distance": "10",
            "calorie": "66",
            "speed_top": "12",
            "speed_low": "1",
            "speed": "12355",
            "time_start": "2020-04-01 12:30:00",
            "time_end": "2020-04-01 12:30:00",
            "time_run": 666666,
            "latitude_start": "wwww",
            "longitude_start": "aaa",
            "latitude_end": "234 dolore",
            "longitude_end": "ad",
            "isshared": 0,
            "created_at": "2020-04-15 19:28:56",
            "updated_at": "2020-04-15 19:28:56",
            "imgs": {
              "original": "http://dev.run.nunet.cn/resources/images/2020-02-04/5e3858831fa42-1080x1920.jpg",
              "thumbnail": "http://dev.run.nunet.cn/resources/images/2020-02-04/5e3858831fa42-min-200x356.jpg"
            }
          }],     //运动列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
                    that.setData({
                        runData: result.data.data
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
            pageindex = this.data.pageindex;
            pagesize = this.data.pagesize;
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

})