
import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShareInApp: false,
        // run: {
        //     "ruid": 1,
        //     "rid": 22,
        //     "distance": "21.07",
        //     "calorie": "166",
        //     "speed_top": "3",
        //     "speed_low": "3",
        //     "speed": 2.8,
        //     "time_start": "2020-05-02 12:00:00",
        //     "time_end": "2020-05-02 12:30:00",
        //     "time_run": 67,
        //     "latitude_start": "12123123123",
        //     "longitude_start": "enim labore",
        //     "latitude_end": "234 dolore",
        //     "longitude_end": "ad",
        //     "isshared": "0",
        //     "created_at": "2020-04-01 16:24:49",
        //     "updated_at": "2020-04-01 16:32:00"
        // }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let user = app.getUser();
        this.eventChannel = this.getOpenerEventChannel();
        if(options.isDraw == 1){  //绘图跳转
            //监听从上个页面传来的数据
            this.eventChannel.on('getDataFromRunPage', function(data) {
                that.setData({ 
                    user,
                    run: data,
                    isShareInApp: false
                });
            })
        }else{   //分享到动态圈子
            this.eventChannel.on('getImgFromRunPage', function(img) {
                that.setData({ 
                    user,
                    shareImg: img,
                    ruid: options.ruid,
                    isShareInApp: true
                });
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },


    //确认分享
    doShare() {
        let that = this;
        this.uploadImg().then(res=>{
            wx.request({
                url: app.config.getHostUrl() + '/api/run/doShare',
                data: {
                    ruid: that.data.ruid,
                    rid: that.data.user.rid,
                    text: that.data.message,
                    img: res
                },
                method: 'POST',
                success: (result)=>{
                    if(result.data.isSuccess){
                        Notify({
                            type: 'success',
                            message: result.data.msg
                        });
                        this.eventChannel.emit('whenShared', {isSuccess: true, msg: '分享成功'});
                        wx.navigateBack();
                    }
                },
                fail: ()=>{
                    this.eventChannel.emit('whenShared', {isSuccess: false, msg: '分享失败'});
                    wx.navigateBack();
                },
                complete: ()=>{}
            });
        })
    },
    onChange(e) {
        this.setData({
            message: e.detail
        })
    },
    uploadImg() {
        let that = this;
        return new Promise((resolved, rejected)=>{
            wx.uploadFile({
                url: app.config.getHostUrl() + '/api/main/uploadImg',
                filePath: that.data.shareImg,
                name: 'img',
                success(res) {
                    let rd = JSON.parse(res.data);
                    if(rd.isSuccess){
                        resolved(rd.data)
                    }else{
                        rejected()
                    }
                },
                fail(err){
                    rejected()
                }
            });
        });
    }
})