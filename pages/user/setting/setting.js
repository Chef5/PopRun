import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowloading: false,
        // 通用设置：
        //     低电量提示: true(默认), false
        //     开启倒计时语音：true(默认), false
        //     整公里震动提示：true(默认), false
        //     运动时屏幕常亮：true(默认), false
        //     提示方式: 1数字(默认), 0红点, 2免打扰
        //     检查更新
        //     注销账户
        setting: {
            power: true,
            voice: true,
            shake: true,
            screen: true,
            method: '1'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initData();
    },

    /**
     * 初始化数据
     */
    initData (){
        let setting = wx.getStorageSync('setting');
        if(setting){
            this.setData({ setting })
        }
        let user = app.getUser();
        this.setData({ user });
    },

    save(setting) {
        wx.setStorageSync('setting', setting);
    },
    
    /**
     * 选项设置区
     */
    powerChange ({ detail }) {
        let setting = this.data.setting;
        setting.power = detail;
        this.setData({ setting });
        this.save(setting);
    },
    voiceChange ({ detail }) {
        let setting = this.data.setting;
        setting.voice = detail;
        this.setData({ setting });
        this.save(setting);
    },
    shakeChange ({ detail }) {
        let setting = this.data.setting;
        setting.shake = detail;
        this.setData({ setting });
        this.save(setting);
    },
    screenChange ({ detail }) {
        let setting = this.data.setting;
        setting.screen = detail;
        this.setData({ setting });
        this.save(setting);
    },
    //单选框
    methodChange({ detail }) {
        let setting = this.data.setting;
        setting.method = detail;
        this.setData({ setting });
        this.save(setting);
    },

    //检查更新
    checkUpdate() {
        Toast.loading({
            mask: false,
            duration: 1500,
            message: '检测中...',
          });
        setTimeout(()=>{
            Toast({
                duration: 2000,
                message: '当前已是最新版本'
            });
        }, 1800);
    },

    // 注销账号
    deleteUser() {
        let that = this;
        Dialog.confirm({
            title: '危险操作',
            message: '该操作不可撤销，一旦确认，将从本系统中删除您的所有数据，请谨慎操作',
            confirmButtonText: '取消',
            cancelButtonText: '确认'
        })
        .then(() => {

        })
        .catch(()=>{
            Dialog.confirm({
                title: '再次确认',
                message: '确认要注销您的账户，并清除您所有的数据吗？',
                confirmButtonText: '取消',
                cancelButtonText: '确认'
            })
            .then(() => {
            
            })
            .catch(()=>{
                wx.request({
                    url: app.config.getHostUrl()+'/api/user/doUnset',
                    data: {
                        rid: that.data.user.rid
                    },
                    method: 'POST',
                    success: (result)=>{
                        
                    },
                    fail: ()=>{},
                    complete: ()=>{}
                });
            })
        })
    }
})