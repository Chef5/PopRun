const format = require("../../utils/util");
const Share = require("../../utils/share");
const app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        run: {
            type: Object,  //数据类型
            value: null    //默认值
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        runobj: {},           //用于渲染的运动数据
        isShowDetail: false,  //显示详细弹窗
    },

    /**
     * 生命周期：加载前处理数据
     */
    attached: function() {
        let that = this;
        // let user = wx.getStorageSync('user');
        // if(user && user.constructor != Object) user = JSON.parse(user);
        // that.setData({ uesr });
        that._initData(that.properties.run, that)
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 初始化数据
        _initData(run, that) {
            run.day = run.time_start.split(' ')[0].replace(new RegExp('-', 'g'), '/');
            run.time = run.time_start.split(' ')[1].split(':').filter((item,index) => index<2).join(':');
            if(run.distance != null){
                run.isFinished = true;
                run.timeRun = format.formatPeriod2time(run.time_run);
                run.speed = format.formatSpeed(run.speed);
                run.speed_top = format.formatSpeed(run.speed_top);
                run.speed_low = format.formatSpeed(run.speed_low);
            }else{
                run.isFinished = false;
                run.timeRun = '--:--';
                run.speed = '--′--″';
            }
            that.setData({ runobj: run })
        },

        // 查看运动详细
        showDetail() {
            let that = this;
            //画图
            Share.getCanvasWX6B('#runImg', this).then(canvas=>{
                let run = this.properties.run;
                //分享背景 渐变色
                // run.color = {
                //     from: 'red',
                //     to: 'white',
                //     direction: 5
                // };
                Share.makeShareImg(canvas, run, false);
            })
            this.setData({
                isShowDetail: true
            })
        },

        // 删除记录
        doDelete() {
            let that = this;
            this.setData({
                isShowDetail: false
            })
            this.triggerEvent('delete', that.data.runobj);
        },

        // 分享
        doShare() {
            let that = this;
            this.setData({
                isShowDetail: false
            })
            this.triggerEvent('share', that.data.runobj);
        },

        // 关闭弹窗
        onClose() {
            this.setData({
                isShowDetail: false
            })
        }
    }
})
