// pages/moments/newMoment/newMoment.js
import Notify from '@vant/weapp/notify/notify';
const app =  getApp();
let prevPage = {};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        text: "",
        fileList: [],
        user: JSON.parse(wx.getStorageSync('user')),  //获取当前用户信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let pages = getCurrentPages();
        prevPage = pages[pages.length-2];
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 发布动态
     */
    onPublish: function () {
        let that = this;
        if(that.data.text == ""){
            Notify({ type: 'danger', message: "内容呢？！" });
            return;
        }
        const { fileList = [] } = that.data;
        fileList.forEach(element => {
            delete element.url;
        });
        wx.request({
            url: app.config.getHostUrl()+'/api/moments/doMoment',
            data: {
                rid: that.data.user.rid,
                text: that.data.text,
                imgs: fileList
            },
            header: {'content-type':'application/json'},
            method: 'POST',
            success: (result)=>{
                if(result.data.isSuccess){
                    Notify({ type: 'success', message: result.data.msg });
                    // let moments = [];
                    // prevPage.getMoments()
                    //     .then((res)=>{
                    //         if(res.data.data.moments.length != 0){
                    //             res.data.data.moments.forEach(element => {
                    //                 moments.push(element);
                    //             });
                    //             prevPage.setData({ moments });
                    //         }
                    //     })
                    //     .catch((res)=>{
                    //         console.log(res)
                    //     })
                    
                    wx.navigateBack();
                }else{
                    Notify({ type: 'danger', message: result.data.msg });
                }
            },
            fail: (res)=>{
                Notify({ type: 'danger', message: "123" });
            },
            complete: ()=>{}
        });
    },

    /**
     * 
     * @param {*} event 
     */
    onInput: function (event) {
        this.setData({
            text: event.detail.value
        });
    },

    /**
     * 添加图片
     * @param {*} file 
     */
    onReadfile: function (event) {
        let that = this;
        const { file } = event.detail;
        wx.uploadFile({
            url: app.config.getHostUrl()+'/api/main/uploadImg',
            filePath: file.path,
            name: 'img',
            success(res) {
                let rd = JSON.parse(res.data);
                const { fileList = [] } = that.data;
                fileList.push({ ...rd.data, url: rd.data.thumbnail });
                that.setData({ fileList });
            }
        });
    },

    /**
     * 图片删除
     * @param {*} event
     */
    onDeleteImg: function (event) {
        const { fileList = [] } = this.data;
        fileList.splice(event.detail.index, 1);
        this.setData({ fileList });
    }
})