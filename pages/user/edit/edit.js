// pages/user/edit/edit.js
import Notify from '@vant/weapp/notify/notify';
const app = getApp();
//获取到image-cropper实例
let cropper = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowCropper: false,
        imgsrc: '',  //裁剪原图
        width: 250,//裁剪框宽度
        height: 250,//裁剪框高度

        user: {},
        userOld: "",  //原始数据，用户判断是否更新。对象格式属于引用数据，会同时改变
        imgNew: null, //裁剪好的图，通过和原图是否同地址 判断是否换了头像
        imgOld: null, //原来的头像
    },
    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options)
        let that = this;
        this.eventChannel = this.getOpenerEventChannel();
        //监听从上个页面传来的数据
        this.eventChannel.on('getDataFromUserPage', function(data) {
            // console.log('上个页面传来的',data)
            data.sex = data.sex+''; //Vant bug性别需要转换成字符串才能默认选中
            that.setData({ 
                user: data,
                userOld: JSON.stringify(data), 
                imgOld: data.img
            });
        })
        // this.getUser(10);
        cropper = this.selectComponent("#image-cropper");
    },

    
    // 获取用户信息
    getUser: function(rid){
        let that = this;
        wx.request({
            url: app.config.getHostUrl()+'/api/user/getUser',
            method: 'post',
            data: { rid },
            success: (res) => {
                if(res.data.isSuccess){
                    that.setData({ 
                        user: res.data.data,
                        imgOld: res.data.data.img
                    });
                }
            }
        })
    },
    
    /**
     * 图片裁剪功能
     */
    // 选择图片
    startChoose(){
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: (res)=>{
                console.log(res)
                //开始裁剪
                that.setData({
                    imgsrc: res.tempFilePaths[0],
                    isShowCropper: true
                });
                wx.showLoading({
                    title: '加载中'
                })
            },
            fail: (res)=>{
                console.log(res.errMsg)
            }
        });
    },
    // 初始化完成
    cropperload(e){
        // console.log("cropper初始化完成");
    },
    // 加载图片完成
    loadimage(e){
        // console.log("图片加载完成",e.detail);
        wx.hideLoading();
        console.log(cropper)
        //重置图片角度、缩放、位置
        cropper.imgReset();
    },
    // 裁剪图片
    clickcut(e) {
        // console.log(e.detail);
        //点击裁剪框阅览图片
        // wx.previewImage({
        //     current: e.detail.url, // 当前显示图片的http链接
        //     urls: [e.detail.url] // 需要预览的图片http链接列表
        // })
        let user = this.data.user;
        user.img = e.detail.url;
        this.setData({
            user,
            imgNew: e.detail.url,
            isShowCropper: false
        })
    },

    //还原头像
    resetImg(){
        let user = this.data.user;
        user.img = this.data.imgOld;
        this.setData({
            user,
            imgNew: null
        })
    },

    //保存修改
    save(){
        let user = this.data.user;
        if(this.data.imgNew!=null && this.data.imgNew!=this.data.imgOld){ //修改了头像
            wx.showLoading({
                title: '上传头像中...'
            })
            this.uploadImg(this.data.imgNew)
                .then((res)=>{
                    wx.showLoading({
                        title: '保存中...'
                    })
                    user.img = res.url;
                    this.saveUser(user);
                })
                .catch((res)=>{
                    wx.hideLoading();
                    console.log('头像上传失败：', res)
                })
        }else{
            this.saveUser(user);
        }
    },
    //上传头像
    uploadImg(imgPath){
        return new Promise((resolve, reject)=>{
            wx.uploadFile({
                url: app.config.getHostUrl()+'/api/user/uploadImg',
                filePath: imgPath,
                name: 'img',
                success(res) {
                    let rd = JSON.parse(res.data);
                    if(rd.isSuccess){
                        resolve(rd.data);
                    }else{
                        reject(rd.msg)
                    }
                },
                fail(res) {
                    reject(res.errMsg)
                }
            });
        })
    },
    //保存用户
    saveUser(user){
        if(JSON.stringify(this.data.user) != this.data.userOld){
            wx.request({
                url: app.config.getHostUrl()+'/api/user/doUpdate',
                data: user,
                method: 'post',
                success: (res) => {
                    if(res.data.isSuccess){
                        wx.hideLoading();
                        Notify({ type: 'success', message: res.data.msg });
                        this.eventChannel.emit('whenUpdated', res.data.data);
                        setTimeout(function(){
                            wx.navigateBack();
                        }, 1200);
                    }else{
                        Notify({ type: 'danger', message: res.data.msg });
                        setTimeout(function(){
                            wx.navigateBack();
                        }, 1200);
                    }
                },
                fail: (res)=>{
                    wx.hideLoading();
                    Notify({ type: 'danger', message: res.errMsg });
                    setTimeout(function(){
                        wx.navigateBack();
                    }, 1200);
                }
            });
        }else{
            wx.hideLoading();
            Notify({ type: 'warning', message: '您未做任何修改哦' });
        }
    },

    //输入框
    onFieldChange(e){
        let user = this.data.user;
        user[e.currentTarget.dataset.who] = e.detail;
        this.setData({ user });
    },
    onFieldConfirm(e){
        let user = this.data.user;
        user[e.currentTarget.dataset.who] = e.detail;
        this.setData({ user });
    },

    //单选框
    onChange(event) {
        let user = this.data.user;
        user.sex = event.detail;
        this.setData({ user });
    },
})