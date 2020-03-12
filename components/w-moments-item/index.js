// components/w-moments-item/index.js
const app = getApp();
const time2cn = require('../../utils/time2cn');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        moment: {
            type: Object,  //数据类型
            value: null    //默认值
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showmore: false,  //显示点赞评论
        showcomment: false,  //显示评论输入框
        placeholder: "",  //评论框placeholder
        input: "",  //输入框内容
        showsingleimg: false, //查看单张图片
        singleimgurl: "", //单张图片地址
        imageWidth: "", //单图时，计算出的长宽比例
        imageHeight: "",
        //动态数据
        data: {}
    },
    /**
     * 生命周期
     */
    attached: function() {
        let that = this;
        // console.log(that.properties.moment);
        that.properties.moment.created_at = time2cn.time2cn(that.properties.moment.created_at);
        that.setData({
            data: that.properties.moment
        });
        that._initData(that.data.data.imgs.thumbnail,that)
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //初始化数据
        _initData: (d,e)=>{
            if(d.length == 1){
                e.setData({
                    imageWidth: Math.floor(d[0].width*420/d[0].height),
                    imageHeight: 420
                })
            }
        },
        // 点击容器
        cancelAll: function(){
            this.setData({
                showmore: false,
                showcomment: false
            })
        },
        // 点击图片，查看大图
        showBigimg: function(e){
            wx.previewImage({
                current: e.currentTarget.dataset.url, // 当前显示图片的http链接
                urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
            })
            // this.setData({
            //     singleimgurl: e.currentTarget.dataset.url,
            //     showsingleimg: true
            // })
        },
        // 关闭大图
        onClose: function(){
            this.setData({
                showsingleimg: false,
                singleimgurl: ""
            })
        },
        // 点击更多：显示点赞和评论
        doShowmore: function(){
            let that = this;
            that.setData({
                showmore: !that.data.showmore
            })
        },
        // 点赞
        doLike: function(){
            let that = this;
            let user = app.getUser();
            if(!user){
                user = wx.getStorageSync('user');
                if(!user) return;
            }
            wx.request({
              url: app.config.getHostUrl()+'/api/moments/doLike',
              method: 'post',
              data: {
                 "rid": user.rid,
                 "moid":that.data.data.moid
              },
              success: (res)=>{
                // console.log(res);
                that.refreshThis(that.data.data.moid, "likes");                                                                                       
              },
              fail: (res)=>{
                console.log(res);
              }
            })
            that.setData({
                showmore: false
            })
        },
        // 打开评论
        doComment: function(e){
            let that = this;
            that.setData({
                showmore: false,
                showcomment: true,
                placeholder: e.currentTarget.dataset.nickname ? "re:" + e.currentTarget.dataset.nickname : "期待神评"
            })
        },
        // 获取输入框的值
        handleInput: function(e){
            this.setData({
                input: e.detail.value
            })
        },
        // 确认评论
        commentConfirm: function(e){
            let that = this;
            let user = app.getUser();
            if(!user){
                user = wx.getStorageSync('user');
                if(!user) return;
            }
            if(e.detail.value=="" || that.data.input=="") return;
            let data = that.data.data;
            let placeholder = that.data.placeholder;
            // data.comments.push({
            //     uid: 1,
            //     nickname: "测试号",
            //     comment: placeholder != "期待神评" ? placeholder+": "+that.data.input : that.data.input,
            //     pubtime: 1578823299806
            // });
            wx.request({
                url: app.config.getHostUrl()+'/api/moments/doComment',
                method: 'post',
                data: {
                   "rid": user.rid,
                   "moid": that.data.data.moid,
                   "comment": placeholder != "期待神评" ? placeholder+": "+that.data.input : that.data.input,
                },
                success: (res)=>{
                    // console.log(res);
                    that.refreshThis(that.data.data.moid, "comments");                                                                                 
                },
                fail: (res)=>{
                  console.log(res);
                }
            })
            that.setData({
                data: data,
                input: "",
                showcomment: false,
            })
        },
        /**
         * 更新数据
         * @param {*} moid 动态id
         * @param {*} type 更新位置
         */
        refreshThis: function(moid, type){
            if(!moid) return;
            let that = this;
            wx.request({
                url: app.config.getHostUrl()+'/api/moments/getMomentById',
                data: {
                    moid: moid
                },
                header: {'content-type':'application/json'},
                method: 'GET',
                dataType: 'json',
                success: (result)=>{
                    let localData = that.data.data;
                    switch(type){
                        case "likes": {
                            localData.likes = result.data.data.likes;
                            break;
                        }
                        case "comments": {
                            localData.comments = result.data.data.comments;
                            break;
                        }
                    }
                    that.setData({
                        data: localData
                    });
                },
                fail: ()=>{},
                complete: ()=>{}
            });
        }
    }
})
