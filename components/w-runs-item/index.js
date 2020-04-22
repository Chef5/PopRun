const format = require("../../utils/util");

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
        // let user = user = wx.getStorageSync('user');
        // if(user) user = JSON.parse(user);
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
            }else{
                run.isFinished = false;
                run.timeRun = '--:--';
                run.speed = '--′--″';
            }
            that.setData({ runobj: run })
        },

        // 查看运动详细
        showDetail() {
            this.setData({
                isShowDetail: true
            })
        },

        // 关闭弹窗
        onClose() {
            this.setData({
                isShowDetail: false
            })
        }
    }
})
