// components/share-menu/index.js
import Dialog from '@vant/weapp/dialog/dialog';
const Share = require("../../utils/share");

const app = getApp();
const NonID = '#shareNon';
const MonID = '#shareMon'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        run: {
            type: Object,
            value: ({})
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        
    },

    ready: function() {
        //提前绘制
        // this.draw(NonID, false);
        // this.draw(MonID, true);
    },

    /**
     * 组件的方法列表  备注：在此组件内绘制图像总有一些绘制不全的毛病，且事件在真机上无法向上层传递事件
     */
    methods: {
        //分享到动态圈子
        share2moments() {
            this.setData({
                show: false
            })
            this.triggerEvent('sharetoapp');
        },

        //分享到朋友圈
        save2album() {
            this.setData({
                show: false
            })
            this.triggerEvent('sharetomoment');

        },

        //分享给微信好友
        share2frends() {
            let that = this;
            this.setData({
                show: false
            })
            this.triggerEvent('sharetofriend');

            // Share.getFileWX6B(NonID, this, false).then(res=>{
            //     console.log(res)
            //     this.triggerEvent('sharetofriend', res);
            // }).catch(err=>{
            //     console.log(err)
            // })
        },
        //绘图
        draw(nodeID, iswx) {
            let run = this.properties.run;
            let user = app.getUser();
            console.log(run,user)
            if(!run){
                Dialog.alert({
                    message: '数据异常'
                })
                return;
            }
            return new Promise((resolved, rejected)=>{
                //画图
                Share.getCanvasWX6B(nodeID, this).then(canvas=>{
                    //分享背景图
                    let bg = canvas.createImage();
                    bg.src = '../../imgs/default/sharebg.png';
                    run.bg = bg;
                    //小程序码
                    let ercode = canvas.createImage();
                    ercode.src = '../../imgs/ercode.jpg';
                    user.ercode = ercode;
                    Share.makeShareImg(canvas, run, iswx, user);
                    resolved();
                }).catch(err=>{
                    rejected(err)
                })
            })
        },

        
        // 关闭弹窗
        onClose() {
            this.setData({
                show: false
            })
        }
    }
})
