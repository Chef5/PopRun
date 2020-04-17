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
        this.initData(options.rid);
    },

    /**
     * 初始化数据
     * @param {*} rid
     */
    initData (rid){
        let that = this;
        that.setData({
            isShowloading: true
        });
        wx.request({
            url: app.config.getHostUrl() + '/api/user/getProvicy',
            data: {
                rid: rid
            },
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

    /**
     * 保存设置
     * @param {*} data
     */
    save (data) {
        let that = this;
        if(!data) data = this.data.privacy;
        wx.request({
            url: app.config.getHostUrl() + '/api/user/doSettings',
            data: data,
            header: {'content-type':'application/json'},
            method: 'post',
            success: (result)=>{
                // if(result.data.isSuccess){
                //     that.setData({
                //         privacy: result.data.data,
                //     })
                // }
            },
            fail: ()=>{},
            complete: ()=>{}
        });
    },

    /**
     * 选项设置区
     */
    teamChange ({ detail }) {
        let privacy = this.data.privacy;
        privacy.team = detail ? 1 : 0;
        this.setData({ privacy });
        this.save(privacy);
    },
    jobChange ({ detail }) {
        let privacy = this.data.privacy;
        privacy.job = detail ? 1 : 0;
        this.setData({ privacy });
        this.save(privacy);
    },
    runChange ({ detail }) {
        let privacy = this.data.privacy;
        privacy.run = detail ? 1 : 0;
        this.setData({ privacy });
        this.save(privacy);
    },
})